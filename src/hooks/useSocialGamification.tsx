
import { useState, useEffect } from 'react';
import { useFriendsData } from './useFriendsData';
import { useNotificationAnalytics } from './useNotificationAnalytics';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'social' | 'trendsetter' | 'explorer' | 'engagement';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  maxProgress: number;
  completed: boolean;
  completedAt?: Date;
  reward?: string;
}

interface UserStats {
  totalRSVPs: number;
  firstToRSVP: number;
  trendsettingScore: number;
  socialInfluence: number;
  streakDays: number;
  venuesExplored: number;
  friendsInfluenced: number;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar: string;
  score: number;
  badges: string[];
  position: number;
}

export const useSocialGamification = () => {
  const { friends } = useFriendsData();
  const { fomoKPIs } = useNotificationAnalytics();
  
  const [userStats, setUserStats] = useState<UserStats>({
    totalRSVPs: 12,
    firstToRSVP: 3,
    trendsettingScore: 78,
    socialInfluence: 65,
    streakDays: 4,
    venuesExplored: 8,
    friendsInfluenced: 5
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-to-rsvp',
      name: 'Early Bird',
      description: 'Be first to RSVP to 5 events',
      icon: '🐦',
      category: 'trendsetter',
      tier: 'bronze',
      progress: 3,
      maxProgress: 5,
      completed: false
    },
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Influence 10 friends to join events',
      icon: '🦋',
      category: 'social',
      tier: 'silver',
      progress: 5,
      maxProgress: 10,
      completed: false
    },
    {
      id: 'trendsetter-gold',
      name: 'Trendsetter',
      description: 'Reach trendsetting score of 80',
      icon: '🔥',
      category: 'trendsetter',
      tier: 'gold',
      progress: 78,
      maxProgress: 80,
      completed: false
    },
    {
      id: 'venue-explorer',
      name: 'Venue Explorer',
      description: 'Check in to 15 different venues',
      icon: '🗺️',
      category: 'explorer',
      tier: 'bronze',
      progress: 8,
      maxProgress: 15,
      completed: false
    },
    {
      id: 'engagement-master',
      name: 'Engagement Master',
      description: 'Maintain 90% notification engagement rate',
      icon: '⚡',
      category: 'engagement',
      tier: 'platinum',
      progress: fomoKPIs.notificationEngagementRate,
      maxProgress: 90,
      completed: false
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const calculateTrendsetterScore = () => {
    const earlyRSVPWeight = userStats.firstToRSVP * 10;
    const influenceWeight = userStats.friendsInfluenced * 5;
    const explorationWeight = userStats.venuesExplored * 3;
    const streakWeight = userStats.streakDays * 2;
    
    return Math.min(100, earlyRSVPWeight + influenceWeight + explorationWeight + streakWeight);
  };

  const updateUserAction = (action: 'rsvp' | 'first-rsvp' | 'influence-friend' | 'explore-venue' | 'check-in') => {
    setUserStats(prev => {
      const updated = { ...prev };
      
      switch (action) {
        case 'rsvp':
          updated.totalRSVPs++;
          break;
        case 'first-rsvp':
          updated.firstToRSVP++;
          updated.totalRSVPs++;
          break;
        case 'influence-friend':
          updated.friendsInfluenced++;
          break;
        case 'explore-venue':
          updated.venuesExplored++;
          break;
        case 'check-in':
          // Update streak logic
          updated.streakDays = Math.min(updated.streakDays + 1, 30);
          break;
      }
      
      updated.trendsettingScore = calculateTrendsetterScore();
      updated.socialInfluence = Math.min(100, updated.friendsInfluenced * 8 + updated.totalRSVPs * 2);
      
      return updated;
    });

    checkAchievements();
    console.log(`🎮 Gamification Action: ${action}`);
  };

  const checkAchievements = () => {
    setAchievements(prev => prev.map(achievement => {
      let newProgress = achievement.progress;
      
      switch (achievement.id) {
        case 'first-to-rsvp':
          newProgress = userStats.firstToRSVP;
          break;
        case 'social-butterfly':
          newProgress = userStats.friendsInfluenced;
          break;
        case 'trendsetter-gold':
          newProgress = userStats.trendsettingScore;
          break;
        case 'venue-explorer':
          newProgress = userStats.venuesExplored;
          break;
        case 'engagement-master':
          newProgress = fomoKPIs.notificationEngagementRate;
          break;
      }
      
      const completed = newProgress >= achievement.maxProgress;
      
      if (completed && !achievement.completed) {
        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
        return {
          ...achievement,
          progress: newProgress,
          completed: true,
          completedAt: new Date()
        };
      }
      
      return {
        ...achievement,
        progress: newProgress
      };
    }));
  };

  const generateLeaderboard = () => {
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        userId: 'user-1',
        name: 'You',
        avatar: '👑',
        score: userStats.trendsettingScore,
        badges: achievements.filter(a => a.completed).map(a => a.icon),
        position: 0
      },
      ...friends.slice(0, 9).map((friend, index) => ({
        userId: friend.id.toString(),
        name: friend.name,
        avatar: friend.avatar,
        score: Math.floor(Math.random() * 40) + 50, // 50-90 range
        badges: ['🎯', '🌟'].slice(0, Math.floor(Math.random() * 3)),
        position: 0
      }))
    ];

    // Sort by score and assign positions
    const sorted = mockLeaderboard
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, position: index + 1 }));

    setLeaderboard(sorted);
  };

  const getNextMilestone = () => {
    const incompleteAchievements = achievements.filter(a => !a.completed);
    if (incompleteAchievements.length === 0) return null;

    return incompleteAchievements
      .sort((a, b) => (a.progress / a.maxProgress) - (b.progress / b.maxProgress))
      .reverse()[0];
  };

  const getSocialInfluenceLevel = () => {
    if (userStats.socialInfluence >= 90) return { level: 'Influencer', color: 'text-purple-600', icon: '👑' };
    if (userStats.socialInfluence >= 70) return { level: 'Trendsetter', color: 'text-orange-600', icon: '🔥' };
    if (userStats.socialInfluence >= 50) return { level: 'Socializer', color: 'text-blue-600', icon: '🌟' };
    if (userStats.socialInfluence >= 30) return { level: 'Explorer', color: 'text-green-600', icon: '🗺️' };
    return { level: 'Newcomer', color: 'text-gray-600', icon: '🌱' };
  };

  // Update achievements and leaderboard periodically
  useEffect(() => {
    checkAchievements();
    generateLeaderboard();
  }, [userStats, fomoKPIs.notificationEngagementRate]);

  return {
    userStats,
    achievements,
    leaderboard,
    updateUserAction,
    getNextMilestone,
    getSocialInfluenceLevel,
    completedAchievements: achievements.filter(a => a.completed),
    totalScore: userStats.trendsettingScore
  };
};
