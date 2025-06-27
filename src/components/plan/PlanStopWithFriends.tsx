
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Stop } from '@/data/plansData';
import { StopAttendance, FriendStatus } from '@/types/planFriendTracking';
import FriendStatusList from './FriendStatusList';
import FriendAvatarCluster from '@/components/social/FriendAvatarCluster';

interface PlanStopWithFriendsProps {
  stop: Stop;
  index: number;
  isCurrentStop: boolean;
  status: string;
  stopAttendance: StopAttendance | undefined;
  friendStatuses: FriendStatus[];
  getStatusBadge: (status: string, index: number) => React.ReactNode;
  accentColor: string;
}

const PlanStopWithFriends = ({
  stop,
  index,
  isCurrentStop,
  status,
  stopAttendance,
  friendStatuses,
  getStatusBadge,
  accentColor
}: PlanStopWithFriendsProps) => {
  const [showFriendDetails, setShowFriendDetails] = useState(false);

  // Calculate time range based on estimated time (placeholder logic)
  const getTimeRange = () => {
    // This is placeholder logic - in a real app, this would come from the plan data
    const baseTime = new Date();
    baseTime.setHours(19 + index, 15, 0, 0); // Start at 7:15 PM for first stop
    const endTime = new Date(baseTime.getTime() + stop.estimatedTime * 60000);
    
    const startTimeStr = baseTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
    const endTimeStr = endTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
    
    return `${startTimeStr}-${endTimeStr}`;
  };

  if (!stopAttendance) {
    return (
      <div className={`relative flex items-center space-x-4 p-3 rounded-lg transition-all duration-500 ${
        isCurrentStop ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
      }`}>
        <div className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-500 ${
          status === 'completed' || status === 'current-checked-in' 
            ? 'bg-green-500 border-green-500' 
            : isCurrentStop 
              ? 'bg-primary border-primary' 
              : 'bg-background border-border'
        }`} />
        
        <div className="flex-1 flex items-center justify-between">
          <div className="flex-1">
            <p className={`font-medium text-sm ${isCurrentStop ? 'text-primary' : ''}`}>
              {stop.name}
            </p>
            <p className="text-xs text-muted-foreground">{stop.type}</p>
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            {getStatusBadge(status, index)}
            <p className="text-xs text-muted-foreground">{getTimeRange()}</p>
          </div>
        </div>
      </div>
    );
  }

  const totalFriends = stopAttendance.friendsPresent.length + 
                      stopAttendance.friendsEnRoute.length + 
                      stopAttendance.friendsNoResponse.length + 
                      stopAttendance.friendsLeftEarly.length;

  // Convert friends data to the format expected by FriendAvatarCluster with required FriendPresence properties
  const allFriends = [
    ...stopAttendance.friendsPresent.map(friend => ({ 
      ...friend, 
      status: 'checked-in' as const,
      venue: stop.name,
      venueId: stop.id,
      checkedInAt: new Date().toISOString()
    })),
    ...stopAttendance.friendsEnRoute.map(friend => ({ 
      ...friend, 
      status: 'on-the-way' as const,
      venue: stop.name,
      venueId: stop.id,
      checkedInAt: new Date().toISOString()
    }))
  ];

  return (
    <div className={`relative transition-all duration-500 ${
      isCurrentStop ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
    } rounded-lg`}>
      <div className="flex items-center space-x-4 p-3">
        <div className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-500 ${
          status === 'completed' || status === 'current-checked-in' 
            ? 'bg-green-500 border-green-500' 
            : isCurrentStop 
              ? 'bg-primary border-primary' 
              : 'bg-background border-border'
        }`} />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <p className={`font-medium text-sm ${isCurrentStop ? 'text-primary' : ''}`}>
                {stop.name}
              </p>
              <p className="text-xs text-muted-foreground">{stop.type}</p>
            </div>
            
            <div className="flex flex-col items-end space-y-1">
              {getStatusBadge(status, index)}
              <p className="text-xs text-muted-foreground">{getTimeRange()}</p>
            </div>
          </div>

          {totalFriends > 0 && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFriendDetails(!showFriendDetails)}
                className="h-auto p-2 w-full justify-between hover:bg-muted/50"
              >
                <FriendAvatarCluster 
                  friends={allFriends} 
                  maxDisplay={4} 
                  showStatus={true} 
                  size="sm" 
                />
                {showFriendDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>

              {showFriendDetails && (
                <div className="mt-3 pl-2 border-l-2 border-primary/20">
                  <FriendStatusList
                    friendsPresent={stopAttendance.friendsPresent}
                    friendsEnRoute={stopAttendance.friendsEnRoute}
                    friendsNoResponse={stopAttendance.friendsNoResponse}
                    friendsLeftEarly={stopAttendance.friendsLeftEarly}
                    friendStatuses={friendStatuses}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanStopWithFriends;
