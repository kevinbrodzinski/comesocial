
import { useState, useEffect } from 'react';
import { useNotificationAnalytics } from './useNotificationAnalytics';

interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-1
  config: {
    timing?: {
      preEventMinutes?: number;
      friendCheckinDelay?: number;
      crowdThreshold?: number;
    };
    messaging?: {
      friendCheckin?: string[];
      crowdAlert?: string[];
      optimalTiming?: string[];
    };
    grouping?: {
      enabled: boolean;
      maxGroupSize?: number;
      groupDelaySeconds?: number;
    };
  };
}

interface ABTest {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  variants: ABTestVariant[];
  metrics: {
    [variantId: string]: {
      impressions: number;
      engagements: number;
      conversions: number;
    };
  };
  startDate: Date;
  endDate?: Date;
}

export const useNotificationABTesting = () => {
  const [activeTests, setActiveTests] = useState<ABTest[]>([]);
  const [userVariant, setUserVariant] = useState<string | null>(null);
  const { trackEngagement } = useNotificationAnalytics();

  // Initialize with default A/B tests
  useEffect(() => {
    const defaultTests: ABTest[] = [
      {
        id: 'timing-test-1',
        name: 'Friend Check-in Timing',
        status: 'active',
        variants: [
          {
            id: 'timing-15min',
            name: '15 Minute Delay',
            weight: 0.5,
            config: {
              timing: { friendCheckinDelay: 15 * 60 * 1000 }
            }
          },
          {
            id: 'timing-30min',
            name: '30 Minute Delay',
            weight: 0.5,
            config: {
              timing: { friendCheckinDelay: 30 * 60 * 1000 }
            }
          }
        ],
        metrics: {
          'timing-15min': { impressions: 0, engagements: 0, conversions: 0 },
          'timing-30min': { impressions: 0, engagements: 0, conversions: 0 }
        },
        startDate: new Date()
      },
      {
        id: 'messaging-test-1',
        name: 'Crowd Alert Copy',
        status: 'active',
        variants: [
          {
            id: 'perfect-time',
            name: 'Perfect Time Messaging',
            weight: 0.5,
            config: {
              messaging: {
                crowdAlert: [
                  'Perfect time to join the buzz!',
                  'Crowd is at the perfect level—join now!',
                  'Ideal energy at {venue}—perfect timing!'
                ]
              }
            }
          },
          {
            id: 'crowd-peaking',
            name: 'Crowd Peaking Messaging',
            weight: 0.5,
            config: {
              messaging: {
                crowdAlert: [
                  'Crowd is peaking at {venue}!',
                  '{venue} is buzzing—peak energy!',
                  'Peak crowd level reached—join the scene!'
                ]
              }
            }
          }
        ],
        metrics: {
          'perfect-time': { impressions: 0, engagements: 0, conversions: 0 },
          'crowd-peaking': { impressions: 0, engagements: 0, conversions: 0 }
        },
        startDate: new Date()
      }
    ];

    setActiveTests(defaultTests);
  }, []);

  const assignUserToVariant = (testId: string): string => {
    const test = activeTests.find(t => t.id === testId);
    if (!test || test.status !== 'active') return test?.variants[0]?.id || '';

    // Use a simple hash-based assignment for consistent user experience
    const userId = localStorage.getItem('userId') || 'anonymous';
    const hash = Array.from(userId + testId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (hash % 1000) / 1000;

    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight) {
        return variant.id;
      }
    }

    return test.variants[0].id;
  };

  const getVariantConfig = (testId: string) => {
    const test = activeTests.find(t => t.id === testId);
    if (!test) return null;

    const variantId = assignUserToVariant(testId);
    const variant = test.variants.find(v => v.id === variantId);
    
    return variant?.config || null;
  };

  const trackTestImpression = (testId: string, variantId?: string) => {
    const actualVariantId = variantId || assignUserToVariant(testId);
    
    setActiveTests(prev => prev.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          metrics: {
            ...test.metrics,
            [actualVariantId]: {
              ...test.metrics[actualVariantId],
              impressions: test.metrics[actualVariantId].impressions + 1
            }
          }
        };
      }
      return test;
    }));

    console.log(`🧪 A/B Test Impression: ${testId} - ${actualVariantId}`);
  };

  const trackTestEngagement = (testId: string, variantId?: string) => {
    const actualVariantId = variantId || assignUserToVariant(testId);
    
    setActiveTests(prev => prev.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          metrics: {
            ...test.metrics,
            [actualVariantId]: {
              ...test.metrics[actualVariantId],
              engagements: test.metrics[actualVariantId].engagements + 1
            }
          }
        };
      }
      return test;
    }));

    trackEngagement(`test-${testId}`, 'click', `ab-test-${actualVariantId}`);
  };

  const trackTestConversion = (testId: string, variantId?: string) => {
    const actualVariantId = variantId || assignUserToVariant(testId);
    
    setActiveTests(prev => prev.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          metrics: {
            ...test.metrics,
            [actualVariantId]: {
              ...test.metrics[actualVariantId],
              conversions: test.metrics[actualVariantId].conversions + 1
            }
          }
        };
      }
      return test;
    }));

    trackEngagement(`test-${testId}`, 'convert', `ab-test-${actualVariantId}`);
  };

  const getTestResults = (testId: string) => {
    const test = activeTests.find(t => t.id === testId);
    if (!test) return null;

    const results = Object.entries(test.metrics).map(([variantId, metrics]) => {
      const variant = test.variants.find(v => v.id === variantId);
      const engagementRate = metrics.impressions > 0 ? (metrics.engagements / metrics.impressions) * 100 : 0;
      const conversionRate = metrics.engagements > 0 ? (metrics.conversions / metrics.engagements) * 100 : 0;

      return {
        variantId,
        variantName: variant?.name || variantId,
        ...metrics,
        engagementRate,
        conversionRate,
        totalScore: engagementRate + (conversionRate * 2)
      };
    });

    return results.sort((a, b) => b.totalScore - a.totalScore);
  };

  return {
    activeTests,
    assignUserToVariant,
    getVariantConfig,
    trackTestImpression,
    trackTestEngagement,
    trackTestConversion,
    getTestResults
  };
};
