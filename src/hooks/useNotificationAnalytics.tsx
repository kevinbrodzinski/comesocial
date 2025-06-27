
import { useState, useEffect } from 'react';
import { useNotificationSystem } from './useNotificationSystem';

interface NotificationMetrics {
  opens: number;
  clicks: number;
  dismissals: number;
  conversions: number;
  totalSent: number;
}

interface EngagementEvent {
  id: string;
  type: 'open' | 'click' | 'dismiss' | 'convert';
  notificationType: string;
  venue?: string;
  timestamp: Date;
  userId?: string;
}

interface FOMOKPIs {
  notificationEngagementRate: number;
  rsvpConversionRate: number;
  planJoinRate: number;
  retentionImpact: number;
  avgResponseTime: number;
}

export const useNotificationAnalytics = () => {
  const [metrics, setMetrics] = useState<NotificationMetrics>({
    opens: 0,
    clicks: 0,
    dismissals: 0,
    conversions: 0,
    totalSent: 0
  });
  
  const [engagementEvents, setEngagementEvents] = useState<EngagementEvent[]>([]);
  const [fomoKPIs, setFomoKPIs] = useState<FOMOKPIs>({
    notificationEngagementRate: 0,
    rsvpConversionRate: 0,
    planJoinRate: 0,
    retentionImpact: 0,
    avgResponseTime: 0
  });

  const trackEngagement = (
    notificationId: string,
    eventType: 'open' | 'click' | 'dismiss' | 'convert',
    notificationType: string,
    venue?: string
  ) => {
    const event: EngagementEvent = {
      id: `${notificationId}-${eventType}-${Date.now()}`,
      type: eventType,
      notificationType,
      venue,
      timestamp: new Date()
    };

    setEngagementEvents(prev => [...prev, event]);
    
    setMetrics(prev => ({
      ...prev,
      [eventType === 'open' ? 'opens' : 
       eventType === 'click' ? 'clicks' :
       eventType === 'dismiss' ? 'dismissals' : 'conversions']: 
       prev[eventType === 'open' ? 'opens' : 
           eventType === 'click' ? 'clicks' :
           eventType === 'dismiss' ? 'dismissals' : 'conversions'] + 1
    }));

    console.log(`📊 Notification Analytics: ${eventType} for ${notificationType}`, {
      notificationId,
      venue,
      timestamp: event.timestamp
    });
  };

  const trackNotificationSent = (notificationType: string, venue?: string) => {
    setMetrics(prev => ({
      ...prev,
      totalSent: prev.totalSent + 1
    }));

    console.log(`📤 Notification Sent: ${notificationType}`, { venue });
  };

  const calculateKPIs = () => {
    const totalEngagements = metrics.opens + metrics.clicks;
    const engagementRate = metrics.totalSent > 0 ? (totalEngagements / metrics.totalSent) * 100 : 0;
    const conversionRate = totalEngagements > 0 ? (metrics.conversions / totalEngagements) * 100 : 0;

    // Calculate average response time from recent events
    const recentEvents = engagementEvents
      .filter(e => (Date.now() - e.timestamp.getTime()) < 24 * 60 * 60 * 1000)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    let avgResponseTime = 0;
    if (recentEvents.length > 1) {
      const timeDiffs = [];
      for (let i = 1; i < recentEvents.length; i++) {
        timeDiffs.push(recentEvents[i].timestamp.getTime() - recentEvents[i-1].timestamp.getTime());
      }
      avgResponseTime = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length / 1000 / 60; // Convert to minutes
    }

    setFomoKPIs({
      notificationEngagementRate: engagementRate,
      rsvpConversionRate: conversionRate,
      planJoinRate: metrics.conversions > 0 ? (metrics.conversions / metrics.totalSent) * 100 : 0,
      retentionImpact: engagementRate * 0.7, // Mock calculation
      avgResponseTime
    });
  };

  const getTopPerformingNotifications = () => {
    const notificationPerformance = engagementEvents.reduce((acc, event) => {
      if (!acc[event.notificationType]) {
        acc[event.notificationType] = { opens: 0, clicks: 0, conversions: 0 };
      }
      
      if (event.type === 'open') acc[event.notificationType].opens++;
      if (event.type === 'click') acc[event.notificationType].clicks++;
      if (event.type === 'convert') acc[event.notificationType].conversions++;
      
      return acc;
    }, {} as Record<string, { opens: number; clicks: number; conversions: number }>);

    return Object.entries(notificationPerformance)
      .map(([type, data]) => ({
        type,
        score: data.clicks + (data.conversions * 3),
        ...data
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  // Update KPIs every 30 seconds
  useEffect(() => {
    const interval = setInterval(calculateKPIs, 30000);
    calculateKPIs(); // Initial calculation
    return () => clearInterval(interval);
  }, [metrics, engagementEvents]);

  return {
    metrics,
    fomoKPIs,
    engagementEvents,
    trackEngagement,
    trackNotificationSent,
    getTopPerformingNotifications,
    calculateKPIs
  };
};
