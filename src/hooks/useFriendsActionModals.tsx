import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFriendsActionModals = () => {
  const { toast } = useToast();

  // Modal states
  const [inviteToPlanModal, setInviteToPlanModal] = useState<{ isOpen: boolean; selectedFriends: any[] }>({
    isOpen: false,
    selectedFriends: []
  });

  const [friendGroupJoinModal, setFriendGroupJoinModal] = useState<{ isOpen: boolean; groupFriends: any[]; venue: string }>({
    isOpen: false,
    groupFriends: [],
    venue: ''
  });

  const [attendeeListModal, setAttendeeListModal] = useState<{ isOpen: boolean; venue: string; attendees: any[] }>({
    isOpen: false,
    venue: '',
    attendees: []
  });

  const [soloFriendModal, setSoloFriendModal] = useState<{ isOpen: boolean; friend: any | null }>({
    isOpen: false,
    friend: null
  });

  const [venueDetailModal, setVenueDetailModal] = useState<{ isOpen: boolean; venue: string; friendsAtVenue: any[] }>({
    isOpen: false,
    venue: '',
    friendsAtVenue: []
  });

  // New group action modal state
  const [groupActionModal, setGroupActionModal] = useState<{ 
    isOpen: boolean; 
    friends: any[]; 
    venue: string; 
    action: 'ping' | 'plan' 
  }>({
    isOpen: false,
    friends: [],
    venue: '',
    action: 'ping'
  });

  // Handlers
  const handleInviteToPlan = (selectedFriends: any[] = []) => {
    setInviteToPlanModal({ isOpen: true, selectedFriends });
  };

  const handleFriendGroupJoin = (groupFriends: any[], venue: string) => {
    setFriendGroupJoinModal({ isOpen: true, groupFriends, venue });
  };

  const handleAttendeeList = (venue: string, attendees: any[]) => {
    setAttendeeListModal({ isOpen: true, venue, attendees });
  };

  const handleSoloFriendAction = (friend: any) => {
    setSoloFriendModal({ isOpen: true, friend });
  };

  const handleVenueDetail = (venue: string, friendsAtVenue: any[]) => {
    setVenueDetailModal({ isOpen: true, venue, friendsAtVenue });
  };

  // New group action handlers
  const handleGroupChat = (friends: any[], venue: string) => {
    toast({
      title: "Group chat started! 💬",
      description: `Started chat with ${friends.length} friends at ${venue}`
    });
  };

  const handleGroupAction = (friends: any[], venue: string, action: 'ping' | 'plan') => {
    setGroupActionModal({ isOpen: true, friends, venue, action });
  };

  const handleGroupPing = () => {
    toast({
      title: "Ping sent! 👋",
      description: "Your friends have been notified you want to join"
    });
    setGroupActionModal({ isOpen: false, friends: [], venue: '', action: 'ping' });
  };

  const handleStartGroupPlan = () => {
    toast({
      title: "Plan started! ✨",
      description: "Creating a new plan with your friends"
    });
    setGroupActionModal({ isOpen: false, friends: [], venue: '', action: 'plan' });
    
    // Trigger plan creation with pre-filled data
    const event = new CustomEvent('startPlanCreation', {
      detail: { 
        preSelectedFriends: groupActionModal.friends,
        preSelectedVenue: groupActionModal.venue
      }
    });
    window.dispatchEvent(event);
  };

  const handleJoinGroup = () => {
    toast({
      title: "Joining the crew! 🎉",
      description: "Your friends have been notified you're on your way"
    });
    setFriendGroupJoinModal({ isOpen: false, groupFriends: [], venue: '' });
  };

  const handlePingGroup = () => {
    toast({
      title: "Ping sent! 📱",
      description: "Your friends will get a notification"
    });
    setFriendGroupJoinModal({ isOpen: false, groupFriends: [], venue: '' });
  };

  const handleMessageAll = () => {
    toast({
      title: "Group chat started! 💬",
      description: `Chat with ${attendeeListModal.venue} crew`
    });
    setAttendeeListModal({ isOpen: false, venue: '', attendees: [] });
  };

  const handlePingAll = () => {
    toast({
      title: "Pinged everyone! 📍",
      description: "All friends at the venue have been notified"
    });
    setAttendeeListModal({ isOpen: false, venue: '', attendees: [] });
  };

  const handleMessageFriend = () => {
    toast({
      title: "Message sent! 💬",
      description: `Started chat with ${soloFriendModal.friend?.name}`
    });
    setSoloFriendModal({ isOpen: false, friend: null });
  };

  const handleInviteFriendToPlan = () => {
    handleInviteToPlan([soloFriendModal.friend]);
    setSoloFriendModal({ isOpen: false, friend: null });
  };

  const handlePingFriend = () => {
    toast({
      title: "Ping sent! 📱",
      description: `${soloFriendModal.friend?.name} will get your message`
    });
    setSoloFriendModal({ isOpen: false, friend: null });
  };

  const handleJoinVenuePlan = () => {
    toast({
      title: "Joined venue plan! 🎯",
      description: `You're now part of the ${venueDetailModal.venue} plan`
    });
    setVenueDetailModal({ isOpen: false, venue: '', friendsAtVenue: [] });
  };

  const handlePingVenueFriends = () => {
    toast({
      title: "Friends pinged! 📍",
      description: `All friends at ${venueDetailModal.venue} have been notified`
    });
    setVenueDetailModal({ isOpen: false, venue: '', friendsAtVenue: [] });
  };

  return {
    // Modal states
    inviteToPlanModal,
    friendGroupJoinModal,
    attendeeListModal,
    soloFriendModal,
    venueDetailModal,
    groupActionModal,

    // Modal handlers
    handleInviteToPlan,
    handleFriendGroupJoin,
    handleAttendeeList,
    handleSoloFriendAction,
    handleVenueDetail,
    handleGroupChat,
    handleGroupAction,

    // Action handlers
    handleJoinGroup,
    handlePingGroup,
    handleMessageAll,
    handlePingAll,
    handleMessageFriend,
    handleInviteFriendToPlan,
    handlePingFriend,
    handleJoinVenuePlan,
    handlePingVenueFriends,
    handleGroupPing,
    handleStartGroupPlan,

    // Close handlers
    onCloseInviteToPlan: () => setInviteToPlanModal({ isOpen: false, selectedFriends: [] }),
    onCloseFriendGroupJoin: () => setFriendGroupJoinModal({ isOpen: false, groupFriends: [], venue: '' }),
    onCloseAttendeeList: () => setAttendeeListModal({ isOpen: false, venue: '', attendees: [] }),
    onCloseSoloFriend: () => setSoloFriendModal({ isOpen: false, friend: null }),
    onCloseVenueDetail: () => setVenueDetailModal({ isOpen: false, venue: '', friendsAtVenue: [] }),
    onCloseGroupAction: () => setGroupActionModal({ isOpen: false, friends: [], venue: '', action: 'ping' })
  };
};
