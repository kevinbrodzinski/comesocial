
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { withFeatureFlag } from '@/utils/featureFlags';

interface PlannerFloatingActionButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenOptions?: () => void;
}

const PlannerFloatingActionButton = React.forwardRef<HTMLDivElement, PlannerFloatingActionButtonProps>(
  ({ onOpenOptions, ...props }, ref) => {
    const fabPosition = withFeatureFlag('fab-plan-pass-01', 'bottom-[72px]') || 'bottom-6';
    
    return (
      <div 
        ref={ref}
        className={`fixed ${fabPosition} right-6 z-50`}
        {...props}
      >
        <Button
          onClick={onOpenOptions}
          size="lg"
          className={`h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 ${withFeatureFlag('contrast-pass-01', 'shadow-md hover:shadow-md')}`}
        >
          <Plus size={24} />
        </Button>
      </div>
    );
  }
);

PlannerFloatingActionButton.displayName = 'PlannerFloatingActionButton';

export default PlannerFloatingActionButton;
