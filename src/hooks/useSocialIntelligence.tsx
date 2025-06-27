
import { useState, useEffect } from 'react';

export interface FriendPresence {
  id: number;
  name: string;
  avatar: string;
  venue: string;
  venueId: number;
  checkedInAt: string;
  status: 'checked-in' | 'on-the-way' | 'leaving';
  groupSize?: number;
}

export interface VenueMomentum {
  venueId: number;
  venue: string;
  crowdTrend: 'rising' | 'falling' | 'stable';
  trendPercentage: number;
  timeframe: string;
  friendsConsidering: number;
  recentArrivals: number;
}

export interface GroupMovement {
  id: number;
  groupName: string;
  participants: FriendPresence[];
  fromVenue: string;
  toVenue: string;
  movementType: 'planned' | 'spontaneous';
  eta: string;
}

export const useSocialIntelligence = () => {
  const [friendPresences] = useState<FriendPresence[]>([
    {
      id: 1,
      name: 'Alex Martinez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      venue: 'Sky Lounge',
      venueId: 1,
      checkedInAt: new Date().toISOString(),
      status: 'checked-in'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=40&h=40&fit=crop&crop=face',
      venue: 'Underground Club',
      venueId: 2,
      checkedInAt: new Date(Date.now() - 30 * 60000).toISOString(),
      status: 'on-the-way'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      venue: 'Pulse Nightclub',
      venueId: 3,
      checkedInAt: new Date(Date.now() - 15 * 60000).toISOString(),
      status: 'checked-in',
      groupSize: 4
    }
  ]);

  const [venueMomentum] = useState<VenueMomentum[]>([
    {
      venueId: 1,
      venue: 'Sky Lounge',
      crowdTrend: 'rising',
      trendPercentage: 25,
      timeframe: 'last 30 min',
      friendsConsidering: 5,
      recentArrivals: 8
    },
    {
      venueId: 2,
      venue: 'Underground Club',
      crowdTrend: 'stable',
      trendPercentage: 5,
      timeframe: 'last hour',
      friendsConsidering: 2,
      recentArrivals: 3
    },
    {
      venueId: 3,
      venue: 'Pulse Nightclub',
      crowdTrend: 'falling',
      trendPercentage: -15,
      timeframe: 'last hour',
      friendsConsidering: 1,
      recentArrivals: 1
    }
  ]);

  const [groupMovements] = useState<GroupMovement[]>([
    {
      id: 1,
      groupName: 'Friday Night Crew',
      participants: friendPresences.slice(0, 2),
      fromVenue: 'Sky Lounge',
      toVenue: 'Underground Club',
      movementType: 'planned',
      eta: '10:30 PM'
    }
  ]);

  const getFriendsAtVenue = (venueId: number) => {
    return friendPresences.filter(f => f.venueId === venueId && f.status === 'checked-in');
  };

  const getFriendsHeadingToVenue = (venueId: number) => {
    return friendPresences.filter(f => f.venueId === venueId && f.status === 'on-the-way');
  };

  const getVenueMomentumData = (venueId: number) => {
    return venueMomentum.find(v => v.venueId === venueId);
  };

  const getTotalFriendsOut = () => {
    return friendPresences.filter(f => f.status !== 'leaving').length;
  };

  return {
    friendPresences,
    venueMomentum,
    groupMovements,
    getFriendsAtVenue,
    getFriendsHeadingToVenue,
    getVenueMomentumData,
    getTotalFriendsOut
  };
};
