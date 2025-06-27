
import React from 'react';
import PlanInvitationModal from './PlanInvitationModal';
import FullUserProfileModal from '../FullUserProfileModal';
import MessageModal from '../MessageModal';
import PingToHangModal from '../PingToHangModal';

interface FriendProfileModalsProps {
  planInvitationModalOpen: boolean;
  fullProfileModalOpen: boolean;
  messageModalOpen: boolean;
  pingToHangModalOpen: boolean;
  currentFriend: any;
  currentPlan: any;
  userProfileData: any;
  initialPingMessage?: string;
  onClosePlanInvitation: () => void;
  onCloseFullProfile: () => void;
  onCloseMessage: () => void;
  onClosePingToHang: () => void;
  onInviteToPlan: () => void;
  onStartNewPlan: () => void;
  onPingSent: (message: string) => void;
}

const FriendProfileModals = ({
  planInvitationModalOpen,
  fullProfileModalOpen,
  messageModalOpen,
  pingToHangModalOpen,
  currentFriend,
  currentPlan,
  userProfileData,
  initialPingMessage,
  onClosePlanInvitation,
  onCloseFullProfile,
  onCloseMessage,
  onClosePingToHang,
  onInviteToPlan,
  onStartNewPlan,
  onPingSent
}: FriendProfileModalsProps) => {
  return (
    <>
      {/* Plan Invitation Modal */}
      <PlanInvitationModal
        isOpen={planInvitationModalOpen}
        onClose={onClosePlanInvitation}
        friend={currentFriend}
        currentPlan={currentPlan}
        onInvite={onInviteToPlan}
        onStartNewPlan={onStartNewPlan}
      />

      {/* Full User Profile Modal */}
      <FullUserProfileModal
        isOpen={fullProfileModalOpen}
        onClose={onCloseFullProfile}
        user={userProfileData}
      />

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModalOpen}
        onClose={onCloseMessage}
        friend={currentFriend}
        initialMessage={initialPingMessage}
      />

      {/* Ping to Hang Modal */}
      <PingToHangModal
        isOpen={pingToHangModalOpen}
        onClose={onClosePingToHang}
        friend={currentFriend}
        onPingSent={onPingSent}
      />
    </>
  );
};

export default FriendProfileModals;
