
import React from 'react';
import { Calendar, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { getFeatureFlag } from '@/utils/featureFlags';

interface FabPlanDropdownProps {
  onCreatePlan: () => void;
  onCoPlan: () => void;
  children: React.ReactNode;
}

const FabPlanDropdown = ({ onCreatePlan, onCoPlan, children }: FabPlanDropdownProps) => {
  if (!getFeatureFlag('fab-plan-pass-01')) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
        <DropdownMenuItem onClick={onCreatePlan} className="cursor-pointer">
          <Calendar size={16} className="mr-3" />
          <div>
            <p className="font-medium">Create Plan</p>
            <p className="text-xs text-muted-foreground">Start planning your own event</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCoPlan} className="cursor-pointer">
          <Users size={16} className="mr-3" />
          <div>
            <p className="font-medium">Co-plan with Friends</p>
            <p className="text-xs text-muted-foreground">Plan together with your group</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FabPlanDropdown;
