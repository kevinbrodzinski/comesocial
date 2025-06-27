
import React from 'react';
import { X, Users, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
}

const JoinModal = ({ isOpen, onClose, post }: JoinModalProps) => {
  if (!isOpen || !post) return null;

  const handleJoinOption = (option: string) => {
    console.log('Join option:', option, 'Venue:', post.venue);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in-0"
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-xl max-h-[60vh] animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Join the scene at {post.venue}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={() => handleJoinOption('friends')}
            className="w-full flex items-center space-x-3 p-4 rounded-lg bg-card border border-border hover:bg-secondary/50 transition-colors"
          >
            <Users size={20} />
            <div className="text-left">
              <p className="font-medium">Join with friends</p>
              <p className="text-sm text-muted-foreground">Invite friends to come along</p>
            </div>
          </button>

          <button
            onClick={() => handleJoinOption('plan')}
            className="w-full flex items-center space-x-3 p-4 rounded-lg bg-card border border-border hover:bg-secondary/50 transition-colors"
          >
            <Calendar size={20} />
            <div className="text-left">
              <p className="font-medium">Start plan here</p>
              <p className="text-sm text-muted-foreground">Make this your first stop</p>
            </div>
          </button>

          <button
            onClick={() => handleJoinOption('tonight')}
            className="w-full flex items-center space-x-3 p-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            <Plus size={20} />
            <div className="text-left">
              <p className="font-medium">Add to tonight's planner</p>
              <p className="text-sm text-primary-foreground/80">Plan your night around this spot</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default JoinModal;
