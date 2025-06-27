
import { useState, useEffect } from 'react';
import InvitationService, { PlanInvitation } from '../services/InvitationService';
import { useToast } from './use-toast';

export const useInvitations = () => {
  const [invitations, setInvitations] = useState<PlanInvitation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const invitationService = InvitationService.getInstance();
    
    const unsubscribe = invitationService.subscribe((state) => {
      setInvitations(state.invitations);
      setUnreadCount(state.unreadCount);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const respondToInvitation = (invitationId: string, response: 'accepted' | 'declined' | 'maybe') => {
    const invitationService = InvitationService.getInstance();
    const invitation = invitationService.respondToInvitation(invitationId, response);
    
    if (invitation) {
      const responseMessages = {
        accepted: "You're going! 🎉",
        declined: "Response recorded",
        maybe: "Marked as maybe 👍"
      };
      
      toast({
        title: responseMessages[response],
        description: `Response to "${invitation.planName}" sent to organizer`,
      });
    }
  };

  const markAsRead = () => {
    InvitationService.getInstance().markAsRead();
  };

  const getPendingInvitations = () => {
    return invitations.filter(inv => inv.status === 'pending');
  };

  const getRespondedInvitations = () => {
    return invitations.filter(inv => inv.status !== 'pending');
  };

  return {
    invitations,
    unreadCount,
    isLoading,
    pendingInvitations: getPendingInvitations(),
    respondedInvitations: getRespondedInvitations(),
    respondToInvitation,
    markAsRead
  };
};
