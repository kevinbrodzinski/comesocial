
import React, { useEffect, useState } from 'react';
import { PlanProgressState } from '@/services/PlanStateService';

interface PlanStatusIndicatorProps {
  progressState: PlanProgressState;
  statusText: string;
  isTransitioning: boolean;
}

const PlanStatusIndicator = ({ 
  progressState, 
  statusText,
  isTransitioning 
}: PlanStatusIndicatorProps) => {
  const [prevState, setPrevState] = useState(progressState);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (prevState !== progressState) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevState(progressState);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progressState, prevState]);

  const getStatusColor = () => {
    switch (progressState) {
      case 'not_started':
        return 'bg-blue-500';
      case 'en_route':
        return 'bg-blue-500';
      case 'checked_in':
        return 'bg-green-500';
      case 'moving_to_next':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const shouldShowCelebration = progressState === 'checked_in' && prevState !== 'checked_in';

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${getStatusColor()} ${
          isAnimating ? 'animate-scale-pulse' : ''
        } ${shouldShowCelebration ? 'animate-celebration-glow' : ''}`} />
        <span className={`text-sm font-medium text-foreground transition-all duration-500 ${
          isTransitioning ? 'opacity-70 animate-fade-out-down' : 'opacity-100 animate-fade-in-up'
        } ${isAnimating ? 'animate-slide-in-left' : ''}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
};

export default PlanStatusIndicator;
