import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, MessageCircle, LogOut, Navigation, CheckCircle, Timer } from 'lucide-react';
import { Plan } from '@/data/plansData';
import { PlanProgressState } from '@/services/PlanStateService';
import { usePlanFriendTracking } from '@/hooks/usePlanFriendTracking';
import { useUserStatusTracking } from '@/hooks/useUserStatusTracking';
import { getStatusOption, UserStatusType } from '@/types/userStatus';
import PlanHeaderSummary from '../plan/PlanHeaderSummary';
import PlanStopWithFriends from '../plan/PlanStopWithFriends';
import StatusDropdown from '../plan/StatusDropdown';

interface PlanBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  progressState: PlanProgressState;
  currentStopIndex: number;
  onPingGroup: () => void;
  onLeaveVenue: () => void;
  onCheckIn: () => void;
  onMessageFriends: () => void;
  onNavigateToVenue: (stopId: number) => void;
  onMoveToNext: () => void;
}

const PlanBottomSheet = ({
  isOpen,
  onClose,
  plan,
  progressState,
  currentStopIndex,
  onPingGroup,
  onLeaveVenue,
  onCheckIn,
  onMessageFriends,
  onNavigateToVenue,
  onMoveToNext
}: PlanBottomSheetProps) => {
  const [animateProgress, setAnimateProgress] = useState(false);
  const { friendTracking, getFriendStatusSummary, isLoading } = usePlanFriendTracking(plan);
  const { userStatus, updateUserStatus } = useUserStatusTracking(plan);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setAnimateProgress(true), 300);
      return () => clearTimeout(timer);
    } else {
      setAnimateProgress(false);
    }
  }, [isOpen]);

  if (!plan) return null;

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
  const friendStatusSummary = getFriendStatusSummary();

  const handleStatusChange = (status: UserStatusType) => {
    const venueId = currentStop?.id;
    updateUserStatus(status, venueId);
    
    if (status === 'im-here') {
      onCheckIn();
    }
  };

  const currentStatusOption = getStatusOption(userStatus.status);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[80vh] flex flex-col"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          overscrollBehavior: 'contain'
        }}
      >
        <SheetHeader className="flex-shrink-0 pb-4">
          <SheetTitle>
            <PlanHeaderSummary 
              plan={plan}
              friendStatusSummary={friendStatusSummary}
              friendTracking={friendTracking}
            />
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-6 pb-6" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
              {/* Progress Timeline */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
                {/* Animated progress line */}
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

              {/* Additional Actions */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={onMessageFriends}
                  className="flex-1"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Message Friends
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onLeaveVenue}
                  className="flex-1"
                >
                  <LogOut size={16} className="mr-2" />
                  Leave Plan
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PlanBottomSheet;
