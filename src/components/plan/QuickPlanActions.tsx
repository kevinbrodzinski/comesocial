
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Zap, Users, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickPlanActionsProps {
  venue?: {
    id: number;
    name: string;
    type: string;
  };
  onQuickPlan: (planData: any) => void;
  onAddToPlan: (venue: any) => void;
  onInviteFriends: () => void;
}

const QuickPlanActions = ({ venue, onQuickPlan, onAddToPlan, onInviteFriends }: QuickPlanActionsProps) => {
  const { toast } = useToast();

  const handleQuickPlan = () => {
    if (!venue) return;
    
    const quickPlan = {
      name: `Night at ${venue.name}`,
      date: new Date().toLocaleDateString(),
      time: '8:00 PM',
      stops: [venue],
      estimatedDuration: 3,
      estimatedCost: 75,
      isQuickPlan: true
    };
    
    onQuickPlan(quickPlan);
    toast({
      title: "Quick Plan Created!",
      description: `Created "${quickPlan.name}" - ready to invite friends`,
    });
  };

  const handleAddToExisting = () => {
    if (!venue) return;
    
    onAddToPlan(venue);
    toast({
      title: "Added to Plan",
      description: `${venue.name} added to your current plan`,
    });
  };

  if (!venue) return null;

  return (
    <div className="flex flex-col space-y-2 p-3 bg-secondary/20 rounded-lg border">
      <div className="flex items-center space-x-2 mb-2">
        <Zap size={16} className="text-primary" />
        <span className="font-medium text-sm">Quick Actions</span>
        <Badge variant="outline" className="text-xs">
          One-click
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          onClick={handleQuickPlan}
          className="flex items-center space-x-1"
        >
          <Plus size={14} />
          <span>Start Plan</span>
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddToExisting}
          className="flex items-center space-x-1"
        >
          <Plus size={14} />
          <span>Add to Plan</span>
        </Button>
      </div>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onInviteFriends}
        className="flex items-center space-x-1 w-full"
      >
        <Users size={14} />
        <span>Invite Friends First</span>
      </Button>
    </div>
  );
};

export default QuickPlanActions;
