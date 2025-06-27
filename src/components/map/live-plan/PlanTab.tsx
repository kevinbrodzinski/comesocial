
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Timer, MessageCircle, Navigation, LogOut } from 'lucide-react';
import { Plan } from '@/data/plansData';
import { PlanProgressState } from '@/services/PlanStateService';
import { PlanFriendTracking } from '@/types/planFriendTracking';
import { UserStatus, UserStatusType } from '@/types/userStatus';
import { getStatusOption } from '@/types/userStatus';
import PlanStopWithFriends from '../../plan/PlanStopWithFriends';
import StatusDropdown from '../../plan/StatusDropdown';

interface PlanTabProps {
  plan: Plan;
  progressState: PlanProgressState;
  currentStopIndex: number;
  friendTracking: PlanFriendTracking | null;
  userStatus: UserStatus;
  updateUserStatus: (status: UserStatusType, venueId?: number, context?: any) => void;
  onCheckIn: () => void;
  onMoveToNext: () => void;
  onPingGroup: () => void;
  onLeaveVenue: () => void;
}

const PlanTab = ({
  plan,
  progressState,
  currentStopIndex,
  friendTracking,
  userStatus,
  updateUserStatus,
  onCheckIn,
  onMoveToNext,
  onPingGroup,
  onLeaveVenue
}: PlanTabProps) => {
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateProgress(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getStopStatus = (stopIndex: number) => {
    if (stopIndex < currentStopIndex) return 'completed';
    if (stopIndex === currentStopIndex) {
      return progressState === 'checked_in' ? 'current-checked-in' : 'current';
    }
    return 'upcoming';
  };

  const getStatusBadge = (status: string, index: number) => {
    const baseClasses = "transition-all duration-500";
    
    switch (status) {
      case 'completed':
        return (
          <Badge className={`bg-green-500 text-white ${baseClasses} ${animateProgress ? 'scale-100 opacity-100' : 'scale-75 opacity-50'}`}>
            <CheckCircle size={12} className="mr-1" />
            Completed
          </Badge>
        );
      case 'current-checked-in':
        return (
          <Badge className={`bg-green-500 text-white ${baseClasses}`}>
            <CheckCircle size={12} className="mr-1" />
            Checked In
          </Badge>
        );
      case 'current':
        return (
          <Badge className={`bg-blue-500 text-white ${baseClasses} ${animateProgress ? 'scale-100 opacity-100' : 'scale-75 opacity-50'}`}>
            <Timer size={12} className="mr-1" />
            Current
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className={`${baseClasses} ${animateProgress ? 'scale-100 opacity-100' : 'scale-75 opacity-30'}`}>
            Upcoming
          </Badge>
        );
    }
  };

  const currentStop = plan.stops[currentStopIndex];
  const upcomingStops = plan.stops.slice(currentStopIndex + 1);
  const currentStatusOption = getStatusOption(userStatus.status);

  const handleStatusChange = (status: UserStatusType) => {
    const venueId = currentStop?.id;
    updateUserStatus(status, venueId);
    
    if (status === 'im-here') {
      onCheckIn();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ScrollArea 
          className="h-full"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="px-4 space-y-6 pb-32">
            {/* Progress Timeline */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
              <div 
                className={`absolute left-6 top-0 w-0.5 bg-primary transition-all duration-1000 ease-out ${
                  animateProgress ? `h-${Math.min((currentStopIndex / plan.stops.length) * 100, 100)}%` : 'h-0'
                }`}
              ></div>

              <div className="space-y-4">
                {plan.stops.map((stop, index) => {
                  const status = getStopStatus(index);
                  const isCurrent = index === currentStopIndex;
                  const stopAttendance = friendTracking?.stopAttendance.find(sa => sa.stopId === stop.id);
                  
                  return (
                    <PlanStopWithFriends
                      key={stop.id}
                      stop={stop}
                      index={index}
                      isCurrentStop={isCurrent}
                      status={status}
                      stopAttendance={stopAttendance}
                      friendStatuses={friendTracking?.friendStatuses || []}
                      getStatusBadge={getStatusBadge}
                      accentColor="border-l-primary"
                    />
                  );
                })}
              </div>
            </div>

            {/* Current Status Actions */}
            {progressState !== 'completed' && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Current Status</h3>
                  {getStatusBadge(getStopStatus(currentStopIndex), 0)}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={onPingGroup}
                    className="flex-1"
                  >
                    <MessageCircle size={14} className="mr-1" />
                    Ping Group
                  </Button>
                  
                  <StatusDropdown
                    currentStatus={userStatus.status}
                    onStatusChange={handleStatusChange}
                    lastUpdated={userStatus.timestamp}
                  >
                    <Button 
                      size="sm" 
                      className="flex-1 flex items-center space-x-2"
                      variant={userStatus.status === 'im-here' ? 'default' : 'outline'}
                    >
                      <span>{currentStatusOption.icon}</span>
                      <span>{currentStatusOption.label}</span>
                    </Button>
                  </StatusDropdown>

                  {userStatus.status === 'im-here' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={onMoveToNext}
                      className="flex-1"
                    >
                      <Navigation size={14} className="mr-1" />
                      {upcomingStops.length > 0 ? 'Next Spot' : 'End Night'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Sticky End Plan Button */}
      <div className="flex-shrink-0 p-4 border-t bg-background">
        <Button 
          variant="outline" 
          onClick={onLeaveVenue}
          className="w-full"
        >
          <LogOut size={16} className="mr-2" />
          End Plan
        </Button>
      </div>
    </div>
  );
};

export default PlanTab;
