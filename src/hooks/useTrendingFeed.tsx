
import { useState, useEffect } from 'react';
import { Friend } from '@/data/friendsData';

interface TrendingEvent {
  id: number;
  venue: string;
  type: 'event' | 'venue' | 'plan';
  title: string;
  image: string;
  friendEngagement: {
    watching: Friend[];
    rsvped: Friend[];
    checkedIn: Friend[];
  };
  trendingScore: number;
  timeframe: string;
}

interface EngagementMetrics {
  venueId: number;
  venue: string;
  watchCount: number;
  rsvpCount: number;
  checkinCount: number;
  friendIds: number[];
  lastUpdated: Date;
}

export const useTrendingFeed = (friends: Friend[]) => {
  const [trendingEvents, setTrendingEvents] = useState<TrendingEvent[]>([]);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics[]>([]);

  // Mock trending events data
  const mockTrendingEvents: TrendingEvent[] = [
    {
      id: 1,
      venue: 'Sky Lounge',
      type: 'event',
      title: 'Rooftop Fridays Live Music',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
      friendEngagement: {
        watching: friends.slice(0, 4),
        rsvped: friends.slice(1, 3),
        checkedIn: friends.slice(0, 2)
      },
      trendingScore: 85,
      timeframe: 'Tonight'
    },
    {
      id: 2,
      venue: 'Underground Club',
      type: 'venue',
      title: 'Underground Saturday Sessions',
      image: 'https://images.unsplash.com/photo-1571266028243-d220c9c3fad2?w=400&h=300&fit=crop',
      friendEngagement: {
        watching: friends.slice(2, 5),
        rsvped: friends.slice(0, 1),
        checkedIn: []
      },
      trendingScore: 72,
      timeframe: 'Tomorrow'
    },
    {
      id: 3,
      venue: 'Pulse Nightclub',
      type: 'plan',
      title: 'Epic Saturday Night Crawl',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
      friendEngagement: {
        watching: friends.slice(1, 4),
        rsvped: friends.slice(2, 4),
        checkedIn: friends.slice(0, 1)
      },
      trendingScore: 78,
      timeframe: 'This Weekend'
    }
  ];

  const calculateTrendingScore = (metrics: EngagementMetrics): number => {
    const watchWeight = 1;
    const rsvpWeight = 3;
    const checkinWeight = 5;
    const timeDecay = Math.max(0.1, 1 - (Date.now() - metrics.lastUpdated.getTime()) / (24 * 60 * 60 * 1000));
    
    return (
      metrics.watchCount * watchWeight +
      metrics.rsvpCount * rsvpWeight +
      metrics.checkinCount * checkinWeight
    ) * timeDecay;
  };

  const updateEngagementMetrics = (venueId: number, venue: string, type: 'watch' | 'rsvp' | 'checkin', friendId: number) => {
    setEngagementMetrics(prev => {
      const existing = prev.find(m => m.venueId === venueId);
      
      if (existing) {
        const updated = { ...existing };
        
        if (!updated.friendIds.includes(friendId)) {
          updated.friendIds.push(friendId);
          
          switch (type) {
            case 'watch':
              updated.watchCount++;
              break;
            case 'rsvp':
              updated.rsvpCount++;
              break;
            case 'checkin':
              updated.checkinCount++;
              break;
          }
          
          updated.lastUpdated = new Date();
        }
        
        return prev.map(m => m.venueId === venueId ? updated : m);
      } else {
        const newMetric: EngagementMetrics = {
          venueId,
          venue,
          watchCount: type === 'watch' ? 1 : 0,
          rsvpCount: type === 'rsvp' ? 1 : 0,
          checkinCount: type === 'checkin' ? 1 : 0,
          friendIds: [friendId],
          lastUpdated: new Date()
        };
        
        return [...prev, newMetric];
      }
    });
  };

  const getTrendingEvents = (limit: number = 3): TrendingEvent[] => {
    return mockTrendingEvents
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);
  };

  const getFriendEngagementSummary = () => {
    const totalWatching = engagementMetrics.reduce((sum, m) => sum + m.watchCount, 0);
    const totalRSVPed = engagementMetrics.reduce((sum, m) => sum + m.rsvpCount, 0);
    const totalCheckedIn = engagementMetrics.reduce((sum, m) => sum + m.checkinCount, 0);
    
    return {
      totalWatching,
      totalRSVPed,
      totalCheckedIn,
      topVenues: engagementMetrics
        .sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a))
        .slice(0, 3)
    };
  };

  // Initialize with mock data
  useEffect(() => {
    setTrendingEvents(mockTrendingEvents);
  }, []);

  return {
    trendingEvents,
    engagementMetrics,
    updateEngagementMetrics,
    getTrendingEvents,
    getFriendEngagementSummary,
    calculateTrendingScore
  };
};
