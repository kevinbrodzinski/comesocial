import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Loader2 } from 'lucide-react';
import { PlanProgressState } from '@/services/PlanStateService';
import EnhancedStatusDropdown from '../../plan/EnhancedStatusDropdown';
import { UserStatusType, getStatusOption } from '@/types/userStatus';
import { useUserStatusTracking } from '@/hooks/useUserStatusTracking';

interface PlanActionButtonsProps {
  progressState: PlanProgressState;
  hasNextStop: boolean;
  onCheckIn: () => void;
  onStartNight: () => void;
  onMoveToNext: () => void;
  onShowOptions: () => void;
}

const PlanActionButtons = ({ 
  progressState, 
  hasNextStop, 
  onCheckIn, 
  onStartNight, 
  onMoveToNext,
  onShowOptions 
}: PlanActionButtonsProps) => {
  const [loadingStates, setLoadingStates] = useState({
    startPlan: false,
    checkIn: false,
    nextStop: false
  });
  const [prevProgressState, setPrevProgressState] = useState(progressState);
  const { userStatus, updateUserStatus } = useUserStatusTracking(null);

  // Clear loading states when progress state changes
  useEffect(() => {
    if (prevProgressState !== progressState) {
      console.log('🔄 Plan progress state changed from', prevProgressState, 'to', progressState);
      
      // Clear start plan loading when we move from not_started to en_route
      if (prevProgressState === 'not_started' && progressState === 'en_route') {
        console.log('✅ Plan started successfully, clearing loading state');
        setLoadingStates(prev => ({ ...prev, startPlan: false }));
      }
      
      // Clear check in loading when we move to checked_in
      if (progressState === 'checked_in') {
        console.log('✅ Check in completed, clearing loading state');
        setLoadingStates(prev => ({ ...prev, checkIn: false }));
      }
      
      // Clear next stop loading when we transition from checked_in to en_route (moving to next stop)
      if (prevProgressState === 'checked_in' && progressState === 'en_route') {
        console.log('✅ Next stop move completed, clearing loading state');
        setLoadingStates(prev => ({ ...prev, nextStop: false }));
      }
      
      // Also clear loading states on any state change to prevent stuck states
      if (progressState !== prevProgressState) {
        console.log('✅ State changed, clearing all loading states as safety measure');
        setLoadingStates(prev => ({ 
          ...prev, 
          nextStop: false // Always clear nextStop loading on any state change
        }));
      }
      
      setPrevProgressState(progressState);
    }
  }, [progressState, prevProgressState]);

  // Additional safety: Clear nextStop loading after a timeout
  useEffect(() => {
    if (loadingStates.nextStop) {
      const timeout = setTimeout(() => {
        console.log('⚠️ Safety timeout: Clearing stuck nextStop loading state');
        setLoadingStates(prev => ({ ...prev, nextStop: false }));
      }, 3000); // 3 second safety timeout
      
      return () => clearTimeout(timeout);
    }
  }, [loadingStates.nextStop]);

  const setLoadingState = (action: keyof typeof loadingStates, loading: boolean) => {
    console.log(`🔄 Setting ${action} loading state to:`, loading);
    setLoadingStates(prev => ({ ...prev, [action]: loading }));
  };

  const handleStatusChange = async (status: UserStatusType, context?: any) => {
    console.log('🎯 Enhanced status change:', status, context);
    
    if (status === 'im-here') {
      setLoadingState('checkIn', true);
      
      // Update status with enhanced context
      await updateUserStatus(status, undefined, {
        ...context,
        onCheckIn,
        hasNextStop,
        progressState
      });
      
      // Small delay for UI feedback
      setTimeout(() => {
        onCheckIn();
      }, 300);
    } else if (status === 'next-spot') {
      setLoadingState('nextStop', true);
      
      // Update status and auto-trigger move to next
      await updateUserStatus(status, undefined, {
        ...context,
        onMoveToNext,
        hasNextStop,
        progressState
      });
    } else {
      // Update status with enhanced context
      await updateUserStatus(status, undefined, {
        ...context,
        hasNextStop,
        progressState
      });
    }
  };

  const handleStartNight = () => {
    console.log('🚀 Start Plan button clicked, current state:', progressState);
    setLoadingState('startPlan', true);
    
    // Trigger immediately without artificial delay
    onStartNight();
    console.log('🚀 Start Plan action triggered');
  };

  const handleMoveToNext = () => {
    console.log('⏰ Next Stop clicked at:', new Date().toISOString());
    setLoadingState('nextStop', true);
    
    // Trigger the move immediately
    onMoveToNext();
    console.log('⏰ Move to next stop action triggered');
  };

  const currentStatusOption = getStatusOption(userStatus.status);

  const getPrimaryAction = () => {
    console.log('🔍 Checking primary action for state:', progressState, 'loading:', loadingStates.startPlan);
    
    if (progressState === 'not_started') {
      return {
        text: loadingStates.startPlan ? 'Starting...' : 'Start Plan',
        onClick: handleStartNight,
        variant: 'default' as const,
        loading: loadingStates.startPlan
      };
    }
    
    return null;
  };

  const primaryAction = getPrimaryAction();
  const showStatusSelector = progressState === 'en_route' || progressState === 'moving_to_next' || progressState === 'checked_in';
  const showNextStopButton = progressState === 'checked_in' && hasNextStop;

  console.log('🎯 Rendering Enhanced PlanActionButtons:', {
    progressState,
    showStatusSelector,
    showNextStopButton,
    hasPrimaryAction: !!primaryAction,
    loadingStates,
    userStatus: userStatus.status
  });

  return (
    <div className="flex flex-col space-y-2 min-w-0" onClick={(e) => e.stopPropagation()}>
      {/* Enhanced Status selector */}
      {showStatusSelector && (
        <div className="transition-all duration-400 animate-fade-in-up">
          <EnhancedStatusDropdown
            currentStatus={userStatus.status}
            onStatusChange={handleStatusChange}
            lastUpdated={userStatus.timestamp}
            context={{
              hasNextStop,
              progressState,
              onCheckIn,
              onMoveToNext
            }}
          >
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs transition-all duration-500 flex items-center justify-between w-full"
              disabled={loadingStates.checkIn}
            >
              <div className="flex items-center space-x-1.5">
                <div className={`w-2 h-2 rounded-full ${currentStatusOption.bgColor} ${currentStatusOption.borderColor} border flex-shrink-0 transition-all duration-300`} />
                <span className="truncate transition-all duration-300">
                  {loadingStates.checkIn ? 'Processing...' : currentStatusOption.label}
                </span>
              </div>
              {loadingStates.checkIn ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <ChevronDown size={12} className="transition-transform duration-200" />
              )}
            </Button>
          </EnhancedStatusDropdown>
        </div>
      )}
      
      {/* Next Stop button */}
      {showNextStopButton && (
        <div className="flex justify-end transition-all duration-400 animate-fade-in-up">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleMoveToNext}
            disabled={loadingStates.nextStop}
            className="h-7 px-3 text-xs transition-all duration-500 bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50"
          >
            <span className="transition-all duration-300">
              {loadingStates.nextStop && <Loader2 size={12} className="mr-1 animate-spin" />}
              {loadingStates.nextStop ? 'Moving...' : 'Next Spot'}
            </span>
          </Button>
        </div>
      )}
      
      {/* Primary action button */}
      {primaryAction && (
        <div className="transition-all duration-400 animate-fade-in-up">
          <Button
            size="sm"
            variant={primaryAction.variant}
            onClick={primaryAction.onClick}
            disabled={primaryAction.loading}
            className="h-7 px-3 text-xs transition-all duration-500 w-full disabled:opacity-50"
          >
            <span className="transition-all duration-300">
              {primaryAction.loading && <Loader2 size={12} className="mr-1 animate-spin" />}
              {primaryAction.text}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlanActionButtons;
