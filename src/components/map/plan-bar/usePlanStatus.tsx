
import { useState, useEffect } from 'react';
import { PlanProgressState } from '@/services/PlanStateService';

interface UsePlanStatusProps {
  progressState: PlanProgressState;
  currentStopName: string;
  nextStopName?: string;
}

export const usePlanStatus = ({ progressState, currentStopName, nextStopName }: UsePlanStatusProps) => {
  const [statusText, setStatusText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getDefaultStatusText = () => {
    switch (progressState) {
      case 'not_started':
        return `Ready to start at ${currentStopName}`;
      case 'en_route':
        return `On the way to ${currentStopName}`;
      case 'moving_to_next':
        return nextStopName ? `Heading to ${nextStopName}` : 'Night complete!';
      case 'completed':
        return 'Night completed! 🎉';
      default:
        return `At ${currentStopName}`;
    }
  };

  useEffect(() => {
    if (progressState === 'checked_in') {
      setShowCelebration(true);
      setStatusText(`Checked in at ${currentStopName}`);
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setStatusText(`Currently at ${currentStopName}`);
        setShowCelebration(false);
        setIsTransitioning(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
      setIsTransitioning(false);
      setStatusText(getDefaultStatusText());
    }
  }, [progressState, currentStopName, nextStopName]);

  return {
    statusText: statusText || getDefaultStatusText(),
    showCelebration,
    isTransitioning
  };
};
