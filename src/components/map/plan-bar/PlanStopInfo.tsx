
import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { PlanProgressState } from '@/services/PlanStateService';
import { useUserStatusTracking } from '@/hooks/useUserStatusTracking';
import { getStatusOption } from '@/types/userStatus';
import FriendAvatarCluster from '@/components/social/FriendAvatarCluster';

interface PlanStopInfoProps {
  currentStopName: string;
  nextStopName?: string;
  progressState: PlanProgressState;
  attendees: number;
  friendsPresent?: any[];
  friendsEnRoute?: any[];
}

const PlanStopInfo = ({ 
  currentStopName, 
  nextStopName, 
  progressState, 
  attendees,
  friendsPresent = [],
  friendsEnRoute = []
}: PlanStopInfoProps) => {
  const { userStatus } = useUserStatusTracking(null);
  const [prevStopName, setPrevStopName] = useState(currentStopName);
  const [isStopChanging, setIsStopChanging] = useState(false);
  const currentStatusOption = getStatusOption(userStatus.status);

  useEffect(() => {
    if (prevStopName !== currentStopName) {
      setIsStopChanging(true);
      const timer = setTimeout(() => {
        setIsStopChanging(false);
        setPrevStopName(currentStopName);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentStopName, prevStopName]);
  
  const getStatusText = () => {
    if (progressState === 'checked_in' || (progressState === 'en_route' || progressState === 'moving_to_next')) {
      return currentStatusOption.label;
    }
    return null;
  };

  const statusText = getStatusText();

  // Convert friends data to the format expected by FriendAvatarCluster
  const allFriends = [
    ...friendsPresent.map(friend => ({ 
      ...friend, 
      status: 'checked-in' as const,
      venue: currentStopName,
      venueId: friend.id || 1,
      checkedInAt: new Date().toISOString()
    })),
    ...friendsEnRoute.map(friend => ({ 
      ...friend, 
      status: 'on-the-way' as const,
      venue: currentStopName,
      venueId: friend.id || 1,
      checkedInAt: new Date().toISOString()
    }))
  ];

  const getLocationDirectionText = () => {
    switch (progressState) {
      case 'not_started':
        return `Heading to ${currentStopName}`;
      case 'en_route':
        return `On the way to ${currentStopName}`;
      case 'moving_to_next':
        return `Moving to ${nextStopName || 'next stop'}`;
      case 'checked_in':
        return `Checked in at ${currentStopName}`;
      case 'completed':
        return 'Night complete!';
      default:
        return `Heading to ${currentStopName}`;
    }
  };

  return (
    <div className="flex-1 min-w-0 space-y-1">
      {/* Row 1: Colored dot + direction text */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${currentStatusOption.bgColor} ${currentStatusOption.borderColor} border flex-shrink-0 transition-all duration-500 ${
          isStopChanging ? 'animate-scale-pulse' : ''
        }`} />
        <span className={`text-xs text-muted-foreground transition-all duration-400 ${
          isStopChanging ? 'animate-slide-in-left' : ''
        }`}>
          {getLocationDirectionText()}
        </span>
      </div>
      
      {/* Row 2: Location name */}
      <h3 className={`font-semibold text-sm text-foreground truncate transition-all duration-500 ${
        isStopChanging ? 'animate-fade-in-up' : ''
      }`}>
        {currentStopName}
      </h3>
      
      {/* Row 3: Status (will be handled by PlanActionButtons) */}
      
      {/* Row 4: People count + avatars (will include Next Stop button from PlanActionButtons) */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center space-x-1 text-xs text-muted-foreground transition-all duration-300 ${
          isStopChanging ? 'animate-fade-in-up' : ''
        }`}>
          <Users size={12} />
          <span>{attendees} people</span>
        </div>
        {allFriends.length > 0 && (
          <div className={`transition-all duration-400 ${
            isStopChanging ? 'animate-slide-in-left' : ''
          }`}>
            <FriendAvatarCluster 
              friends={allFriends} 
              maxDisplay={4} 
              showStatus={true} 
              size="sm" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanStopInfo;
