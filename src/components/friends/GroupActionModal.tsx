
import React from 'react';
import { X, Users, Zap, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface GroupActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: any[];
  venue: string;
  action: 'ping' | 'plan';
  onPingGroup: () => void;
  onStartPlan: () => void;
}

const GroupActionModal = ({
  isOpen,
  onClose,
  friends,
  venue,
  action,
  onPingGroup,
  onStartPlan
}: GroupActionModalProps) => {
  if (!isOpen) return null;

  const isPingAction = action === 'ping';

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-sm overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {isPingAction ? 'Join the Crew' : 'Plan Together'}
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </div>

          {/* Venue Info */}
          <div className="p-4 border border-border rounded-lg bg-primary/5 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users size={16} className="text-primary" />
              <span className="font-medium text-sm">Friends at {venue}</span>
            </div>
            <div className="flex -space-x-2 mb-3">
              {friends.slice(0, 6).map((friend, index) => (
                <Avatar key={friend.id} className="w-8 h-8 border-2 border-card">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {friend.avatar}
                  </AvatarFallback>
                </Avatar>
              ))}
              {friends.length > 6 && (
                <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                  <span className="text-xs font-semibold text-muted-foreground">
                    +{friends.length - 6}
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {friends.map(f => f.name.split(' ')[0]).join(', ')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isPingAction ? (
              <>
                <Button onClick={onPingGroup} className="w-full" size="lg">
                  <Zap size={16} className="mr-2" />
                  👋 Ping to Hang
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Send a friendly notification to let them know you're interested in joining
                </p>
              </>
            ) : (
              <>
                <Button onClick={onStartPlan} className="w-full" size="lg">
                  <Calendar size={16} className="mr-2" />
                  ✨ Start Plan with this Group
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Create a plan with {venue} and invite all these friends
                </p>
              </>
            )}
            
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupActionModal;
