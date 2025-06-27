
import React, { useState, useEffect } from 'react';
import { Plan } from '@/data/plansData';
import { PlanProgressState } from '@/services/PlanStateService';
import PlanStatusIndicator from './plan-bar/PlanStatusIndicator';
import PlanStopInfo from './plan-bar/PlanStopInfo';
import PlanActionButtons from './plan-bar/PlanActionButtons';
import { usePlanStatus } from './plan-bar/usePlanStatus';
import { usePlanFriendTracking } from '@/hooks/usePlanFriendTracking';

interface FloatingPlanBarProps {
  plan: Plan;
  progressState: PlanProgressState;
  currentStopIndex: number;
  onOpenPlanSheet: () => void;
  onCheckIn: () => void;
  onStartNight: () => void;
  onMoveToNext: () => void;
  onShowOptions: () => void;
}

const FloatingPlanBar = ({ 
  plan, 
  progressState,
  currentStopIndex,
  onOpenPlanSheet, 
  onCheckIn,
  onStartNight,
  onMoveToNext,
  onShowOptions 
}: FloatingPlanBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [prevProgressState, setPrevProgressState] = useState(progressState);
  const [isProgressStateChanging, setIsProgressStateChanging] = useState(false);
  const { friendTracking } = usePlanFriendTracking(plan);

  const currentStop = plan.stops[currentStopIndex];
  const nextStop = currentStopIndex + 1 < plan.stops.length ? plan.stops[currentStopIndex + 1] : null;

  const { statusText, showCelebration, isTransitioning } = usePlanStatus({
    progressState,
    currentStopName: currentStop.name,
    nextStopName: nextStop?.name
  });

  // Get current stop attendance
  const currentStopAttendance = friendTracking?.stopAttendance.find(sa => sa.stopId === currentStop.id);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (prevProgressState !== progressState) {
      setIsProgressStateChanging(true);
      const timer = setTimeout(() => {
        setIsProgressStateChanging(false);
        setPrevProgressState(progressState);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progressState, prevProgressState]);

  const handleMainAreaClick = (e: React.MouseEvent) => {
    // Don't open plan sheet if the click came from action buttons area
    const target = e.target as HTMLElement;
    if (target.closest('[data-action-buttons]')) {
      return;
    }
    onOpenPlanSheet();
  };

  return (
    <div className={`fixed bottom-20 left-4 right-4 z-40 transition-all duration-500 ease-out ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
    }`}>
      <div 
        className={`bg-card border border-border rounded-lg shadow-lg p-5 cursor-pointer hover:shadow-xl transition-all duration-300 relative ${
          isProgressStateChanging ? 'animate-scale-pulse' : ''
        } ${showCelebration ? 'animate-celebration-glow' : ''}`}
        onClick={handleMainAreaClick}
      >
        {showCelebration && (
          <div className="absolute inset-0 bg-green-500/10 rounded-lg animate-fade-in-up" />
        )}

        <div className={`transition-all duration-400 ${isProgressStateChanging ? 'animate-fade-in-up' : ''}`}>
          <PlanStatusIndicator
            progressState={progressState}
            statusText={statusText}
            isTransitioning={isTransitioning}
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <PlanStopInfo
            currentStopName={currentStop.name}
            nextStopName={nextStop?.name}
            progressState={progressState}
            attendees={plan.attendees}
            friendsPresent={currentStopAttendance?.friendsPresent || []}
            friendsEnRoute={currentStopAttendance?.friendsEnRoute || []}
          />
          
          <div data-action-buttons>
            <PlanActionButtons
              progressState={progressState}
              hasNextStop={!!nextStop}
              onCheckIn={onCheckIn}
              onStartNight={onStartNight}
              onMoveToNext={onMoveToNext}
              onShowOptions={onShowOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingPlanBar;
