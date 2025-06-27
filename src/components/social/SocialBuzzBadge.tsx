
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Users, Clock } from 'lucide-react';
import { VenueMomentum } from '@/hooks/useSocialIntelligence';

interface SocialBuzzBadgeProps {
  momentum: VenueMomentum;
  showFriendsConsidering?: boolean;
}

const SocialBuzzBadge = ({ momentum, showFriendsConsidering = false }: SocialBuzzBadgeProps) => {
  const getTrendIcon = () => {
    switch (momentum.crowdTrend) {
      case 'rising':
        return <TrendingUp size={10} />;
      case 'falling':
        return <TrendingDown size={10} />;
      default:
        return <Minus size={10} />;
    }
  };

  const getTrendColor = () => {
    switch (momentum.crowdTrend) {
      case 'rising':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'falling':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTrendLabel = () => {
    if (momentum.crowdTrend === 'rising' && momentum.trendPercentage > 20) {
      return 'Getting busy fast 🔥';
    }
    if (momentum.crowdTrend === 'rising') {
      return `+${momentum.trendPercentage}%`;
    }
    if (momentum.crowdTrend === 'falling') {
      return `${momentum.trendPercentage}%`;
    }
    return 'Steady';
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge className={`text-xs px-2 py-1 flex items-center space-x-1 ${getTrendColor()}`}>
        {getTrendIcon()}
        <span>{getTrendLabel()}</span>
      </Badge>

      {showFriendsConsidering && momentum.friendsConsidering > 0 && (
        <Badge variant="outline" className="text-xs px-2 py-1 flex items-center space-x-1 bg-blue-50 text-blue-700 border-blue-200">
          <Users size={10} />
          <span>{momentum.friendsConsidering} friends considering</span>
        </Badge>
      )}

      {momentum.recentArrivals > 0 && (
        <Badge variant="outline" className="text-xs px-2 py-1 flex items-center space-x-1 bg-purple-50 text-purple-700 border-purple-200">
          <Clock size={10} />
          <span>{momentum.recentArrivals} just arrived</span>
        </Badge>
      )}
    </div>
  );
};

export default SocialBuzzBadge;
