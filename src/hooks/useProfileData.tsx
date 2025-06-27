
import { useState, useEffect } from 'react';

export interface BuzzLevel {
  score: number;
  level: string;
  breakdown: {
    checkIns: number;
    friendsPinged: number;
    timeSpent: number;
    engagements: number;
  };
  weeklyChange: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
}

export interface CheckInHistoryItem {
  id: string;
  venue: string;
  date: string;
  time: string;
  crowdLevel: number;
  tags: string[];
  photo?: string;
  memory?: string;
}

export interface FavoriteVenue {
  id: string;
  name: string;
  type: string;
  image: string;
  visitCount: number;
  lastVisited: string;
  category: 'most-visited' | 'saved' | 'notify-when-busy';
  tags: string[];
}

export interface RecentPlan {
  id: string;
  name: string;
  date: string;
  attendees: string[];
  stops: string[];
  cost: string;
  rating?: number;
  type: 'created' | 'attended';
}

export const useProfileData = () => {
  const [profileData] = useState({
    name: 'John Doe',
    handle: 'johndoe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  });

  const [buzzLevel] = useState<BuzzLevel>({
    score: 73,
    level: 'Socialite',
    breakdown: {
      checkIns: 25,
      friendsPinged: 18,
      timeSpent: 15,
      engagements: 15
    },
    weeklyChange: +12
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      name: 'Night Owl',
      description: '10 check-ins past midnight',
      icon: '🦉',
      category: 'Check-ins',
      unlocked: true,
      unlockedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Plan Master',
      description: 'Create 5 public plans',
      icon: '🎯',
      category: 'Planner',
      unlocked: true,
      unlockedAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Rooftop Royalty',
      description: '5 rooftop venue check-ins',
      icon: '🏙️',
      category: 'Venue Type',
      unlocked: false,
      progress: 3,
      maxProgress: 5
    },
    {
      id: '4',
      name: 'Weekend Warrior',
      description: 'Checked in Fri/Sat/Sun in one week',
      icon: '⚔️',
      category: 'Streaks',
      unlocked: false,
      progress: 2,
      maxProgress: 3
    },
    {
      id: '5',
      name: 'Scene Reporter',
      description: 'Upload 3+ photos to the feed',
      icon: '📸',
      category: 'Content',
      unlocked: false,
      progress: 1,
      maxProgress: 3
    },
    {
      id: '6',
      name: 'Connector',
      description: 'Invite 3+ friends to plans',
      icon: '🤝',
      category: 'Friends',
      unlocked: true,
      unlockedAt: '2024-01-10'
    }
  ]);

  const [checkInHistory] = useState<CheckInHistoryItem[]>([
    {
      id: '1',
      venue: 'Sky Bar',
      date: '2024-01-20',
      time: '9:30 PM',
      crowdLevel: 75,
      tags: ['Rooftop', 'Live Music'],
      memory: 'Amazing sunset views!'
    },
    {
      id: '2',
      venue: 'Pulse Nightclub',
      date: '2024-01-19',
      time: '11:45 PM',
      crowdLevel: 90,
      tags: ['Dance', 'Electronic']
    },
    {
      id: '3',
      venue: 'The Green Room',
      date: '2024-01-18',
      time: '8:15 PM',
      crowdLevel: 45,
      tags: ['Chill', 'Cocktails'],
      memory: 'Great cocktails with Sarah'
    }
  ]);

  const [favorites] = useState<FavoriteVenue[]>([
    {
      id: '1',
      name: 'Sky Bar',
      type: 'Rooftop Bar',
      image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=300&h=200&fit=crop',
      visitCount: 8,
      lastVisited: '2024-01-20',
      category: 'most-visited',
      tags: ['Rooftop', 'Views']
    },
    {
      id: '2',
      name: 'Underground Jazz',
      type: 'Jazz Club',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
      visitCount: 0,
      lastVisited: '',
      category: 'saved',
      tags: ['Jazz', 'Live Music']
    }
  ]);

  const [recentPlans] = useState<RecentPlan[]>([
    {
      id: '1',
      name: 'Rooftop Hopping',
      date: '2024-01-20',
      attendees: ['Sarah', 'Mike', 'Lisa'],
      stops: ['Sky Bar', 'Cloud Nine', 'Heights'],
      cost: '$120',
      rating: 5,
      type: 'created'
    },
    {
      id: '2',
      name: 'Birthday Bash',
      date: '2024-01-15',
      attendees: ['Alex', 'Emma', 'Tom', 'Kate'],
      stops: ['Pulse', 'Neon Palace'],
      cost: '$80',
      rating: 4,
      type: 'attended'
    }
  ]);

  return {
    profileData,
    buzzLevel,
    achievements,
    checkInHistory,
    favorites,
    recentPlans
  };
};
