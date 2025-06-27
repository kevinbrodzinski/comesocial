
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Calendar, Clock, MapPin } from 'lucide-react';
import { usePlansData } from '@/hooks/usePlansData';

interface InviteToPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNewPlan: () => void;
  selectedFriends?: any[];
}

const InviteToPlanModal = ({ isOpen, onClose, onCreateNewPlan, selectedFriends = [] }: InviteToPlanModalProps) => {
  const { plans } = usePlansData();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    // TODO: Navigate to friend selection for this plan
    console.log('Selected plan:', plan.name, 'for friends:', selectedFriends);
    onClose();
  };

  const handleCreateNew = () => {
    onCreateNewPlan();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a plan to invite friends to</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create New Plan Option */}
          <Button
            variant="outline"
            className="w-full h-auto p-4 flex items-center justify-between border-dashed border-primary/50 hover:border-primary"
            onClick={handleCreateNew}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Plus size={20} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Create a new plan</p>
                <p className="text-sm text-muted-foreground">Start fresh with your friends</p>
              </div>
            </div>
          </Button>

          {/* Existing Plans */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Your existing plans:</p>
            {plans.length > 0 ? (
              plans.map((plan) => (
                <Button
                  key={plan.id}
                  variant="ghost"
                  className="w-full h-auto p-4 flex items-center justify-between hover:bg-accent"
                  onClick={() => handlePlanSelect(plan)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <Calendar size={16} className="text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{plan.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock size={12} />
                        <span>{plan.date} at {plan.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin size={12} />
                        <span>{plan.stops?.[0]?.name || 'Multiple stops'}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{plan.attendees} going</Badge>
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No existing plans</p>
            )}
          </div>

          {selectedFriends.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Inviting:</p>
              <div className="flex items-center space-x-2">
                {selectedFriends.slice(0, 3).map((friend) => (
                  <Avatar key={friend.id} className="w-8 h-8">
                    <AvatarFallback className="text-xs">{friend.avatar}</AvatarFallback>
                  </Avatar>
                ))}
                {selectedFriends.length > 3 && (
                  <span className="text-sm text-muted-foreground">+{selectedFriends.length - 3} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteToPlanModal;
