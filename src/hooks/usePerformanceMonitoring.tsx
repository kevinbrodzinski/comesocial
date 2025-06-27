import { useState, useEffect, useRef } from 'react';

interface PerformanceMetrics {
  batteryImpact: number; // 0-100 score
  networkRequests: number;
  geofenceChecks: number;
  lastGeofenceLatency: number;
  memoryUsage: number;
  errorRate: number;
  uptime: number;
}

interface PerformanceAlert {
  id: string;
  type: 'battery' | 'network' | 'memory' | 'error';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

// Type definition for the experimental Memory API
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: MemoryInfo;
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    batteryImpact: 0,
    networkRequests: 0,
    geofenceChecks: 0,
    lastGeofenceLatency: 0,
    memoryUsage: 0,
    errorRate: 0,
    uptime: 0
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const startTime = useRef(Date.now());
  const networkRequestCount = useRef(0);
  const geofenceCheckCount = useRef(0);
  const errorCount = useRef(0);
  const totalOperations = useRef(0);

  const trackNetworkRequest = (endpoint: string, duration: number) => {
    networkRequestCount.current++;
    totalOperations.current++;
    
    setMetrics(prev => ({
      ...prev,
      networkRequests: networkRequestCount.current
    }));

    if (duration > 5000) { // > 5 seconds
      addAlert({
        type: 'network',
        message: `Slow network request to ${endpoint} (${duration}ms)`,
        severity: 'medium'
      });
    }

    console.log(`📡 Network Request: ${endpoint} (${duration}ms)`);
  };

  const trackGeofenceCheck = (duration: number) => {
    geofenceCheckCount.current++;
    totalOperations.current++;
    
    setMetrics(prev => ({
      ...prev,
      geofenceChecks: geofenceCheckCount.current,
      lastGeofenceLatency: duration
    }));

    if (duration > 1000) { // > 1 second
      addAlert({
        type: 'network',
        message: `Slow geofence check (${duration}ms)`,
        severity: 'low'
      });
    }
  };

  const trackError = (error: Error, context: string) => {
    errorCount.current++;
    totalOperations.current++;
    
    const errorRate = (errorCount.current / totalOperations.current) * 100;
    
    setMetrics(prev => ({
      ...prev,
      errorRate
    }));

    if (errorRate > 5) { // > 5% error rate
      addAlert({
        type: 'error',
        message: `High error rate detected: ${errorRate.toFixed(1)}%`,
        severity: 'high'
      });
    }

    console.error(`🚨 Performance Error: ${context}`, error);
  };

  const addAlert = (alertData: Omit<PerformanceAlert, 'id' | 'timestamp'>) => {
    const alert: PerformanceAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      timestamp: new Date()
    };

    setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep only 10 most recent
  };

  const monitorBatteryImpact = async () => {
    try {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        const batteryLevel = battery.level * 100;
        const isCharging = battery.charging;
        
        // Simple heuristic: if battery is low and not charging, reduce impact score
        const impactScore = isCharging || batteryLevel > 20 ? 15 : 35;
        
        setMetrics(prev => ({
          ...prev,
          batteryImpact: impactScore
        }));

        if (impactScore > 30) {
          addAlert({
            type: 'battery',
            message: 'High battery impact detected - consider reducing background tasks',
            severity: 'medium'
          });
        }
      }
    } catch (error) {
      console.log('Battery API not available');
    }
  };

  const monitorMemoryUsage = () => {
    // Type assertion for the experimental Memory API
    const performanceWithMemory = performance as PerformanceWithMemory;
    
    if (performanceWithMemory.memory) {
      const memInfo = performanceWithMemory.memory;
      const usedMemoryMB = memInfo.usedJSHeapSize / (1024 * 1024);
      const totalMemoryMB = memInfo.totalJSHeapSize / (1024 * 1024);
      const usagePercentage = (usedMemoryMB / totalMemoryMB) * 100;
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage: usagePercentage
      }));

      if (usagePercentage > 80) {
        addAlert({
          type: 'memory',
          message: `High memory usage: ${usagePercentage.toFixed(1)}%`,
          severity: 'high'
        });
      }
    }
  };

  const getHealthScore = (): number => {
    const batteryScore = Math.max(0, 100 - metrics.batteryImpact);
    const errorScore = Math.max(0, 100 - metrics.errorRate);
    const memoryScore = Math.max(0, 100 - metrics.memoryUsage);
    const latencyScore = Math.max(0, 100 - (metrics.lastGeofenceLatency / 10));
    
    return Math.round((batteryScore + errorScore + memoryScore + latencyScore) / 4);
  };

  const getRecommendations = (): string[] => {
    const recommendations = [];
    
    if (metrics.batteryImpact > 25) {
      recommendations.push('Reduce geofence check frequency to preserve battery');
    }
    
    if (metrics.errorRate > 3) {
      recommendations.push('Implement better error handling and retry logic');
    }
    
    if (metrics.memoryUsage > 70) {
      recommendations.push('Consider cleanup of old notification data');
    }
    
    if (metrics.lastGeofenceLatency > 800) {
      recommendations.push('Optimize geofence calculation algorithms');
    }

    return recommendations;
  };

  // Monitor performance metrics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const uptime = (Date.now() - startTime.current) / 1000 / 60; // minutes
      setMetrics(prev => ({ ...prev, uptime }));
      
      monitorBatteryImpact();
      monitorMemoryUsage();
    }, 30000);

    return () => clearInterval(interval);
  }, [monitorBatteryImpact, monitorMemoryUsage]);

  return {
    metrics,
    alerts,
    trackNetworkRequest,
    trackGeofenceCheck,
    trackError,
    getHealthScore,
    getRecommendations,
    clearAlerts: () => setAlerts([])
  };
};
