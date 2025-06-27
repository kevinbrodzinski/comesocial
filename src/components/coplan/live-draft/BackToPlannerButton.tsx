
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getFeatureFlag } from '@/utils/featureFlags';

interface BackToPlannerButtonProps {
  onBack: () => void;
  className?: string;
}

const BackToPlannerButton = ({ onBack, className = "" }: BackToPlannerButtonProps) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (getFeatureFlag('draft_ios_nav_fix_v1')) {
      // Navigate to home tab in planner view
      navigate('/', { 
        state: { initialTab: 'planner', plannerInitialTab: 'active' },
        replace: true 
      });
    } else {
      // Use the original onBack handler
      onBack();
    }
  };

  return (
    <div className={`p-4 border-t bg-background/95 backdrop-blur-sm ${className}`}>
      <Button
        variant="outline"
        onClick={handleBack}
        className="w-full"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Planner
      </Button>
    </div>
  );
};

export default BackToPlannerButton;
