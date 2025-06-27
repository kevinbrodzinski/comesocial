
import React from 'react';
import { X, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PlanInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  friend: any;
  currentPlan: any;
  onInvite: () => void;
  onStartNewPlan: () => void;
}

const PlanInvitationModal = ({
  isOpen,
  onClose,
  friend,
  currentPlan,
  onInvite,
  onStartNewPlan
}: PlanInvitationModalProps) => {
  if (!isOpen || !friend) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-sm overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Join Friend</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary">
                {friend.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{friend.name}</h4>
              <p className="text-sm text-muted-foreground">
                Currently at {friend.location || 'Unknown location'}
              </p>
            </div>
          </div>

          {currentPlan ? (
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-primary/5">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar size={16} className="text-primary" />
                  <span className="font-medium text-sm">Current Plan</span>
                </div>
                <p className="font-semibold">{currentPlan.name}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Users size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {currentPlan.invitedFriends?.length || 0} friends invited
                  </span>
                </div>
              </div>

              <Button onClick={onInvite} className="w-full">
                Request to join {friend.name.split(' ')[0]}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                You don't have an active plan yet
              </p>
              <Button onClick={onStartNewPlan} className="w-full">
                Start New Plan with {friend.name.split(' ')[0]}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanInvitationModal;
