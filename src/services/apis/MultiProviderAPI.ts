
import { errorHandler } from '../intelligence/ErrorHandler';
import { aiResponseValidator } from '../intelligence/AIResponseValidator';

export interface APIProvider {
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  endpoints: Record<string, string>;
  headers?: Record<string, string>;
  isActive: boolean;
  priority: number; // Lower number = higher priority
}

export interface APIRequest {
  provider: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  provider: string;
  responseTime: number;
  statusCode?: number;
  headers?: Record<string, string>;
}

export interface RateLimitTracker {
  provider: string;
  minuteRequests: number[];
  hourRequests: number[];
  lastReset: Date;
}

export class MultiProviderAPI {
  private providers: Map<string, APIProvider> = new Map();
  private rateLimitTrackers: Map<string, RateLimitTracker> = new Map();
  private failoverQueue: APIRequest[] = [];
  private readonly maxRetries = 3;
  private readonly defaultTimeout = 30000; // 30 seconds

  constructor() {
    this.initializeProviders();
    this.startRateLimitCleanup();
  }

  // Register API provider
  registerProvider(provider: APIProvider): void {
    this.providers.set(provider.name, provider);
    this.rateLimitTrackers.set(provider.name, {
      provider: provider.name,
      minuteRequests: [],
      hourRequests: [],
      lastReset: new Date()
    });
    
    console.log(`🔌 Registered API provider: ${provider.name}`);
  }

  // Make API request with automatic failover
  async request<T = any>(request: APIRequest): Promise<APIResponse<T>> {
    const startTime = Date.now();
    
    try {
      // Get provider
      const provider = this.providers.get(request.provider);
      if (!provider) {
        throw new Error(`Provider ${request.provider} not found`);
      }

      // Check rate limits
      if (!this.checkRateLimit(request.provider)) {
        // Try failover provider
        const failoverProvider = this.getFailoverProvider(request.provider);
        if (failoverProvider) {
          request.provider = failoverProvider.name;
          return this.request(request);
        } else {
          throw new Error(`Rate limit exceeded for ${request.provider} and no failover available`);
        }
      }

      // Make the request
      const response = await this.makeRequest(provider, request);
      
      // Track successful request
      this.trackRequest(request.provider);
      
      // Validate response if it's an AI/structured response
      if (request.endpoint.includes('ai') || request.endpoint.includes('intelligent')) {
        const validated = aiResponseValidator.validateStructuredOutput(
          response.data?.schema || {},
          response.data,
          `MultiProviderAPI.${request.provider}`
        );
        
        if (!validated && response.data) {
          console.warn('⚠️ API response validation failed, using raw response');
        }
      }

      const responseTime = Date.now() - startTime;
      
      console.log(`✅ API request successful: ${request.provider}/${request.endpoint} (${responseTime}ms)`);
      
      return {
        success: true,
        data: response.data,
        provider: request.provider,
        responseTime,
        statusCode: response.status,
        headers: response.headers
      };

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      errorHandler.handleError(
        'ai_call',
        `API request failed: ${request.provider}/${request.endpoint}`,
        {
          component: 'MultiProviderAPI',
          operation: 'request',
          data: { request, error: error.message },
          timestamp: new Date()
        },
        true
      );

      // Try failover if available
      const retries = request.retries || 0;
      if (retries < this.maxRetries) {
        const failoverProvider = this.getFailoverProvider(request.provider);
        if (failoverProvider) {
          console.log(`🔄 Failing over to: ${failoverProvider.name}`);
          return this.request({ ...request, provider: failoverProvider.name, retries: retries + 1 });
        }
      }

      return {
        success: false,
        error: error.message,
        provider: request.provider,
        responseTime,
        statusCode: error.status || 500
      };
    }
  }

  // Make batch requests with load balancing
  async batchRequest<T = any>(requests: APIRequest[]): Promise<APIResponse<T>[]> {
    const results: APIResponse<T>[] = [];
    
    // Group requests by provider for optimal load balancing
    const providerGroups = new Map<string, APIRequest[]>();
    
    requests.forEach(request => {
      const group = providerGroups.get(request.provider) || [];
      group.push(request);
      providerGroups.set(request.provider, group);
    });

    // Execute requests with concurrency control
    const promises: Promise<APIResponse<T>>[] = [];
    
    for (const [providerName, providerRequests] of providerGroups.entries()) {
      const provider = this.providers.get(providerName);
      if (!provider) continue;

      // Limit concurrent requests per provider
      const maxConcurrent = Math.min(5, provider.rateLimits.requestsPerMinute / 2);
      
      for (let i = 0; i < providerRequests.length; i += maxConcurrent) {
        const batch = providerRequests.slice(i, i + maxConcurrent);
        const batchPromises = batch.map(request => this.request<T>(request));
        promises.push(...batchPromises);
      }
    }

    try {
      const responses = await Promise.allSettled(promises);
      
      responses.forEach(response => {
        if (response.status === 'fulfilled') {
          results.push(response.value);
        } else {
          results.push({
            success: false,
            error: response.reason?.message || 'Request failed',
            provider: 'unknown',
            responseTime: 0
          });
        }
      });

      console.log(`📦 Batch request completed: ${results.length} responses`);
      
    } catch (error) {
      errorHandler.handleError(
        'ai_call',
        'Batch request failed',
        {
          component: 'MultiProviderAPI',
          operation: 'batchRequest',
          data: { requestCount: requests.length, error },
          timestamp: new Date()
        },
        true
      );
    }

    return results;
  }

  // Get venue data from multiple sources
  async getVenueData(venueId: number): Promise<APIResponse> {
    const requests: APIRequest[] = [
      {
        provider: 'foursquare',
        endpoint: 'venues',
        method: 'GET',
        params: { venue_id: venueId.toString() }
      },
      {
        provider: 'yelp',
        endpoint: 'businesses',
        method: 'GET',
        params: { id: venueId.toString() }
      }
    ];

    const responses = await this.batchRequest(requests);
    const successfulResponses = responses.filter(r => r.success);

    if (successfulResponses.length === 0) {
      return {
        success: false,
        error: 'No venue data available from any provider',
        provider: 'multiple',
        responseTime: 0
      };
    }

    // Merge data from multiple sources
    const mergedData = this.mergeVenueData(successfulResponses);
    
    return {
      success: true,
      data: mergedData,
      provider: 'aggregated',
      responseTime: Math.max(...successfulResponses.map(r => r.responseTime))
    };
  }

  // Get real-time venue insights
  async getVenueInsights(venueIds: number[]): Promise<APIResponse> {
    const insightRequests: APIRequest[] = [];

    // Add requests for different types of insights
    venueIds.forEach(venueId => {
      insightRequests.push(
        {
          provider: 'crowd_analytics',
          endpoint: 'crowd_level',
          method: 'GET',
          params: { venue_id: venueId.toString() }
        },
        {
          provider: 'event_discovery',
          endpoint: 'events',
          method: 'GET',
          params: { venue_id: venueId.toString(), active: 'true' }
        }
      );
    });

    const responses = await this.batchRequest(insightRequests);
    const insights = this.aggregateInsights(responses, venueIds);

    return {
      success: true,
      data: insights,
      provider: 'aggregated',
      responseTime: Math.max(...responses.map(r => r.responseTime))
    };
  }

  // Make actual HTTP request
  private async makeRequest(provider: APIProvider, request: APIRequest): Promise<any> {
    const url = `${provider.baseUrl}${provider.endpoints[request.endpoint] || request.endpoint}`;
    const timeout = request.timeout || this.defaultTimeout;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...provider.headers
    };

    if (provider.apiKey) {
      headers['Authorization'] = `Bearer ${provider.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method: request.method,
        headers,
        signal: controller.signal
      };

      if (request.data && request.method !== 'GET') {
        fetchOptions.body = JSON.stringify(request.data);
      }

      let requestUrl = url;
      if (request.params && Object.keys(request.params).length > 0) {
        const params = new URLSearchParams(request.params);
        requestUrl += `?${params.toString()}`;
      }

      const response = await fetch(requestUrl, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      };

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Check rate limit for provider
  private checkRateLimit(providerName: string): boolean {
    const provider = this.providers.get(providerName);
    const tracker = this.rateLimitTrackers.get(providerName);
    
    if (!provider || !tracker) return false;

    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;

    // Clean old requests
    tracker.minuteRequests = tracker.minuteRequests.filter(time => time > oneMinuteAgo);
    tracker.hourRequests = tracker.hourRequests.filter(time => time > oneHourAgo);

    // Check limits
    const minuteLimit = provider.rateLimits.requestsPerMinute;
    const hourLimit = provider.rateLimits.requestsPerHour;

    return tracker.minuteRequests.length < minuteLimit && tracker.hourRequests.length < hourLimit;
  }

  // Track request for rate limiting
  private trackRequest(providerName: string): void {
    const tracker = this.rateLimitTrackers.get(providerName);
    if (!tracker) return;

    const now = Date.now();
    tracker.minuteRequests.push(now);
    tracker.hourRequests.push(now);
  }

  // Get failover provider
  private getFailoverProvider(originalProvider: string): APIProvider | null {
    const providers = Array.from(this.providers.values())
      .filter(p => p.name !== originalProvider && p.isActive)
      .sort((a, b) => a.priority - b.priority);

    for (const provider of providers) {
      if (this.checkRateLimit(provider.name)) {
        return provider;
      }
    }

    return null;
  }

  // Merge venue data from multiple sources
  private mergeVenueData(responses: APIResponse[]): any {
    const merged: any = {
      id: null,
      name: null,
      rating: null,
      reviews: [],
      photos: [],
      hours: null,
      contact: {},
      location: {},
      categories: [],
      attributes: {},
      sources: responses.map(r => r.provider)
    };

    responses.forEach(response => {
      if (response.data) {
        // Merge data based on provider format
        Object.keys(response.data).forEach(key => {
          if (merged[key] === null || merged[key] === undefined) {
            merged[key] = response.data[key];
          } else if (Array.isArray(merged[key]) && Array.isArray(response.data[key])) {
            merged[key] = [...merged[key], ...response.data[key]];
          }
        });
      }
    });

    return merged;
  }

  // Aggregate insights from multiple responses
  private aggregateInsights(responses: APIResponse[], venueIds: number[]): any {
    const insights: any = {
      venues: {},
      timestamp: new Date(),
      sources: responses.map(r => r.provider).filter((v, i, a) => a.indexOf(v) === i)
    };

    venueIds.forEach(venueId => {
      insights.venues[venueId] = {
        crowdLevel: null,
        events: [],
        trends: [],
        recommendations: []
      };
    });

    responses.forEach(response => {
      if (response.success && response.data) {
        // Process based on response type and provider
        if (response.provider === 'crowd_analytics' && response.data.venue_id) {
          const venueId = response.data.venue_id;
          if (insights.venues[venueId]) {
            insights.venues[venueId].crowdLevel = response.data.crowd_level;
          }
        } else if (response.provider === 'event_discovery' && response.data.events) {
          response.data.events.forEach((event: any) => {
            if (event.venue_id && insights.venues[event.venue_id]) {
              insights.venues[event.venue_id].events.push(event);
            }
          });
        }
      }
    });

    return insights;
  }

  // Initialize default providers
  private initializeProviders(): void {
    // Sample providers (in production, these would be real API providers)
    const defaultProviders: APIProvider[] = [
      {
        name: 'foursquare',
        baseUrl: 'https://api.foursquare.com/v3',
        rateLimits: { requestsPerMinute: 60, requestsPerHour: 1000 },
        endpoints: {
          venues: '/places',
          search: '/places/search'
        },
        isActive: true,
        priority: 1
      },
      {
        name: 'yelp',
        baseUrl: 'https://api.yelp.com/v3',
        rateLimits: { requestsPerMinute: 30, requestsPerHour: 500 },
        endpoints: {
          businesses: '/businesses',
          search: '/businesses/search'
        },
        isActive: true,
        priority: 2
      },
      {
        name: 'crowd_analytics',
        baseUrl: 'https://api.crowdanalytics.com/v1',
        rateLimits: { requestsPerMinute: 100, requestsPerHour: 2000 },
        endpoints: {
          crowd_level: '/venues/crowd',
          predictions: '/venues/predictions'
        },
        isActive: true,
        priority: 3
      },
      {
        name: 'event_discovery',
        baseUrl: 'https://api.eventdiscovery.com/v1',
        rateLimits: { requestsPerMinute: 50, requestsPerHour: 800 },
        endpoints: {
          events: '/events',
          trending: '/events/trending'
        },
        isActive: true,
        priority: 4
      }
    ];

    defaultProviders.forEach(provider => {
      this.registerProvider(provider);
    });
  }

  // Start rate limit cleanup
  private startRateLimitCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      const oneHourAgo = now - 60 * 60 * 1000;

      this.rateLimitTrackers.forEach(tracker => {
        tracker.minuteRequests = tracker.minuteRequests.filter(time => time > now - 60 * 1000);
        tracker.hourRequests = tracker.hourRequests.filter(time => time > oneHourAgo);
      });
    }, 60 * 1000); // Clean every minute
  }

  // Get provider statistics
  getProviderStats() {
    const stats: Record<string, any> = {};

    this.providers.forEach((provider, name) => {
      const tracker = this.rateLimitTrackers.get(name);
      stats[name] = {
        isActive: provider.isActive,
        priority: provider.priority,
        rateLimits: provider.rateLimits,
        currentUsage: {
          minute: tracker?.minuteRequests.length || 0,
          hour: tracker?.hourRequests.length || 0
        }
      };
    });

    return stats;
  }
}

export const multiProviderAPI = new MultiProviderAPI();
