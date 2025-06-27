
import React, { useState } from 'react';
import { usePlanState } from '@/hooks/usePlanState';
import { useAdvancedNavigation } from '@/hooks/useAdvancedNavigation';
import { useLiveFriendData } from '@/hooks/useLiveFriendData';
import VenuePlanSuggestion from './friends/VenuePlanSuggestion';
import FriendProfileHeader from './friends/FriendProfileHeader';
import FriendVenueInfo from './friends/FriendVenueInfo';
import FriendCompanions from './friends/FriendCompanions';
import FriendActions from './friends/FriendActions';
import FriendProfileModals from './friends/FriendProfileModals';

interface FriendProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  friend: any | null;
  friendsAtSameVenue?: any[];
}

const FriendProfileSheet = ({ 
  isOpen, 
  onClose, 
  friend,
  friendsAtSameVenue = []
}: FriendProfileSheetProps) => {
  const [currentFriendIndex, setCurrentFriendIndex] = useState(0);
  const [planInvitationModalOpen, setPlanInvitationModalOpen] = useState(false);
  const [showVenueSuggestion, setShowVenueSuggestion] = useState(false);
  const [fullProfileModalOpen, setFullProfileModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [pingToHangModalOpen, setPingToHangModalOpen] = useState(false);
  const [initialPingMessage, setInitialPingMessage] = useState<string | undefined>(undefined);
  
  const { hasActivePlan, getCurrentPlan, startPlanWithFriend, inviteFriendToPlan } = usePlanState();
  const { openDirections, navigateToMapWithVenue } = useAdvancedNavigation();
  const { getFriendsAtVenue } = useLiveFriendData();

  if (!isOpen || !friend) return null;

  // Include current friend in the list for lateral navigation
  const allFriendsAtVenue = [friend, ...friendsAtSameVenue.filter(f => f.id !== friend.id)];
  const currentFriend = allFriendsAtVenue[currentFriendIndex] || friend;
  const canNavigatePrevious = currentFriendIndex > 0;
  const canNavigateNext = currentFriendIndex < allFriendsAtVenue.length - 1;

  // Convert friend data to user format for FullUserProfileModal
  const userProfileData = {
    username: currentFriend.name,
    avatar: currentFriend.avatar,
    mutualFriends: Math.floor(Math.random() * 20) + 5, // Mock data
    lastSeen: currentFriend.activity || 'recently'
  };

  const handlePreviousFriend = () => {
    if (canNavigatePrevious) {
      setCurrentFriendIndex(prev => prev - 1);
    }
  };

  const handleNextFriend = () => {
    if (canNavigateNext) {
      setCurrentFriendIndex(prev => prev + 1);
    }
  };

  const handleFriendClick = (clickedFriend: any) => {
    const index = allFriendsAtVenue.findIndex(f => f.id === clickedFriend.id);
    if (index !== -1) {
      setCurrentFriendIndex(index);
    }
  };

  const handleViewProfile = () => {
    setFullProfileModalOpen(true);
  };

  const handleGetDirections = () => {
    // Mock coordinates for the venue - in real app, would come from venue data
    const latitude = 40.7128 + Math.random() * 0.01;
    const longitude = -74.0060 + Math.random() * 0.01;
    openDirections(latitude, longitude, currentFriend.location || 'Venue');
  };

  const handleMessage = () => {
    setMessageModalOpen(true);
  };

  const handlePingToHang = () => {
    setPingToHangModalOpen(true);
  };

  const handleAddToPlan = () => {
    if (hasActivePlan()) {
      setPlanInvitationModalOpen(true);
    } else {
      startPlanWithFriend(currentFriend);
      onClose();
    }
  };

  const handleInviteToPlan = () => {
    inviteFriendToPlan(currentFriend);
    setPlanInvitationModalOpen(false);
    onClose();
  };

  const handleStartNewPlan = () => {
    startPlanWithFriend(currentFriend);
    setPlanInvitationModalOpen(false);
    onClose();
  };

  const handleViewVenueOnMap = () => {
    // Mock venue ID - in real app, would come from venue data
    const venueId = Math.floor(Math.random() * 100) + 1;
    navigateToMapWithVenue(venueId, currentFriend.location);
    onClose();
  };

  const handlePingSent = (selectedMessage: string) => {
    setInitialPingMessage(selectedMessage);
    setTimeout(() => {
      setMessageModalOpen(true);
    }, 500);
  };

  const otherFriendsAtVenue = getFriendsAtVenue(currentFriend.location || '');

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
        <div className="bg-background rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-hidden animate-slide-in-right">
          <div className="p-6 space-y-6">
            {/* Header with Navigation and View Profile Button */}
            <FriendProfileHeader
              currentFriend={currentFriend}
              allFriendsAtVenue={allFriendsAtVenue}
              currentFriendIndex={currentFriendIndex}
              canNavigatePrevious={canNavigatePrevious}
              canNavigateNext={canNavigateNext}
              onPreviousFriend={handlePreviousFriend}
              onNextFriend={handleNextFriend}
              onViewProfile={handleViewProfile}
              onClose={onClose}
            />

            {/* Live Venue Info */}
            <FriendVenueInfo
              currentFriend={currentFriend}
              onViewVenueOnMap={handleViewVenueOnMap}
            />

            {/* Who They're With */}
            <FriendCompanions
              otherFriendsAtVenue={otherFriendsAtVenue}
              onFriendClick={handleFriendClick}
            />

            {/* Venue Plan Suggestion */}
            {showVenueSuggestion && (
              <VenuePlanSuggestion
                venue={currentFriend.location || 'Sky Lounge'}
                friendsAtVenue={otherFriendsAtVenue}
                onJoinPlan={() => {
                  console.log('Join existing plan at venue');
                  setShowVenueSuggestion(false);
                }}
                onCreatePlan={() => {
                  startPlanWithFriend(currentFriend);
                  setShowVenueSuggestion(false);
                  onClose();
                }}
              />
            )}

            {/* Quick CTA Buttons */}
            <FriendActions
              hasActivePlan={hasActivePlan()}
              otherFriendsAtVenue={otherFriendsAtVenue}
              showVenueSuggestion={showVenueSuggestion}
              onGetDirections={handleGetDirections}
              onMessage={handleMessage}
              onPingToHang={handlePingToHang}
              onAddToPlan={handleAddToPlan}
              onShowVenueSuggestion={() => setShowVenueSuggestion(true)}
            />
          </div>
        </div>
      </div>

      {/* All Modals */}
      <FriendProfileModals
        planInvitationModalOpen={planInvitationModalOpen}
        fullProfileModalOpen={fullProfileModalOpen}
        messageModalOpen={messageModalOpen}
        pingToHangModalOpen={pingToHangModalOpen}
        currentFriend={currentFriend}
        currentPlan={getCurrentPlan()}
        userProfileData={userProfileData}
        initialPingMessage={initialPingMessage}
        onClosePlanInvitation={() => setPlanInvitationModalOpen(false)}
        onCloseFullProfile={() => setFullProfileModalOpen(false)}
        onCloseMessage={() => {
          setMessageModalOpen(false);
          setInitialPingMessage(undefined);
        }}
        onClosePingToHang={() => setPingToHangModalOpen(false)}
        onInviteToPlan={handleInviteToPlan}
        onStartNewPlan={handleStartNewPlan}
        onPingSent={handlePingSent}
      />
    </>
  );
};

export default FriendProfileSheet;
