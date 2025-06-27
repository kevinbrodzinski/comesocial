
import { useToast } from '@/hooks/use-toast';
import { VenueReference, FriendReference, PlanReference } from '@/types/smartLinking';

export const useSmartTagActions = () => {
  const { toast } = useToast();

  const handleVenueAction = (action: string, venue: VenueReference) => {
    console.log('Venue action:', action, venue);
    
    switch (action) {
      case 'add-to-plan':
        toast({
          title: "Added to plan",
          description: `${venue.name} has been added to your current plan`,
        });
        // TODO: Integrate with actual plan management
        break;
        
      case 'get-directions':
        if (venue.metadata?.coordinates) {
          const { lat, lng } = venue.metadata.coordinates;
          const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
          window.open(url, '_blank');
        } else {
          toast({
            title: "Getting directions",
            description: `Opening directions to ${venue.name}`,
          });
        }
        break;
        
      case 'save-favorite':
        toast({
          title: "Saved to favorites",
          description: `${venue.name} has been added to your favorites`,
        });
        // TODO: Integrate with favorites system
        break;
    }
  };

  const handleFriendAction = (action: string, friend: FriendReference) => {
    console.log('Friend action:', action, friend);
    
    switch (action) {
      case 'message':
        toast({
          title: "Opening chat",
          description: `Starting conversation with ${friend.name}`,
        });
        // TODO: Open message modal
        break;
        
      case 'invite-to-plan':
        toast({
          title: "Plan invitation sent",
          description: `${friend.name} has been invited to your current plan`,
        });
        // TODO: Integrate with plan invitation system
        break;
        
      case 'view-profile':
        toast({
          title: "Opening profile",
          description: `Viewing ${friend.name}'s profile`,
        });
        // TODO: Open friend profile modal
        break;
    }
  };

  const handlePlanAction = (action: string, plan: PlanReference) => {
    console.log('Plan action:', action, plan);
    
    switch (action) {
      case 'join-plan':
        if (plan.metadata?.isJoined) {
          toast({
            title: "Already joined",
            description: "You're already part of this plan",
            variant: "destructive"
          });
        } else if (!plan.metadata?.canJoin) {
          toast({
            title: "Cannot join",
            description: "This plan is not available to join",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Joined plan",
            description: `You've joined ${plan.name}`,
          });
          // TODO: Integrate with plan joining system
        }
        break;
        
      case 'view-details':
        toast({
          title: "Opening plan details",
          description: `Viewing details for ${plan.name}`,
        });
        // TODO: Open plan details modal
        break;
        
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: plan.name,
            text: `Check out this plan: ${plan.name}`,
            url: window.location.href
          });
        } else {
          toast({
            title: "Plan link copied",
            description: `Link to ${plan.name} copied to clipboard`,
          });
          // TODO: Copy actual plan link to clipboard
        }
        break;
    }
  };

  return {
    handleVenueAction,
    handleFriendAction,
    handlePlanAction
  };
};
