
import React from 'react';
import { Navigation, MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FriendActionsProps {
  hasActivePlan: boolean;
  otherFriendsAtVenue: any[];
  showVenueSuggestion: boolean;
  onGetDirections: () => void;
  onMessage: () => void;
  onPingToHang: () => void;
  onAddToPlan: () => void;
  onShowVenueSuggestion: () => void;
}

const FriendActions = ({
  hasActivePlan,
  otherFriendsAtVenue,
  showVenueSuggestion,
  onGetDirections,
  onMessage,
  onPingToHang,
  onAddToPlan,
  onShowVenueSuggestion
}: FriendActionsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex space-x-3">
        <Button variant="outline" className="flex-1" onClick={onGetDirections}>
          <Navigation size={16} className="mr-2" />
          Get Directions
        </Button>
        <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={onMessage}>
          <MessageCircle size={16} className="mr-2" />
          Message
        </Button>
      </div>

      {/* Personal Options */}
      <div className="flex space-x-3">
        <Button variant="outline" className="flex-1" onClick={onPingToHang}>
          <Plus size={16} className="mr-2" />
          Ping to Hang
        </Button>
        <Button variant="outline" className="flex-1" onClick={onAddToPlan}>
          <Plus size={16} className="mr-2" />
          {hasActivePlan ? 'Join Them' : 'Start Plan'}
        </Button>
      </div>

      {/* Show venue suggestion if friends are at venue */}
      {!showVenueSuggestion && otherFriendsAtVenue.length > 0 && (
        <Button 
          variant="ghost" 
          className="w-full text-primary hover:bg-primary/10"
          onClick={onShowVenueSuggestion}
        >
          View venue plans with {otherFriendsAtVenue.length} friends
        </Button>
      )}
    </div>
  );
};

export default FriendActions;
