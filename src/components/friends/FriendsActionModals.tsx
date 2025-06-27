import React from 'react';
import InviteToPlanModal from './InviteToPlanModal';
import FriendGroupJoinModal from './FriendGroupJoinModal';
import AttendeeListModal from './AttendeeListModal';
import SoloFriendActionModal from './SoloFriendActionModal';
import VenueDetailModal from './VenueDetailModal';
import GroupActionModal from './GroupActionModal';

interface FriendsActionModalsProps {
  // Invite to Plan Modal
  inviteToPlanModal: { isOpen: boolean; selectedFriends: any[] };
  onCloseInviteToPlan: () => void;
  onCreateNewPlan: () => void;

  // Friend Group Join Modal
  friendGroupJoinModal: { isOpen: boolean; groupFriends: any[]; venue: string };
  onCloseFriendGroupJoin: () => void;
  onJoinGroup: () => void;
  onPingGroup: () => void;

  // Attendee List Modal
  attendeeListModal: { isOpen: boolean; venue: string; attendees: any[] };
  onCloseAttendeeList: () => void;
  onMessageAll: () => void;
  onPingAll: () => void;

  // Solo Friend Action Modal
  soloFriendModal: { isOpen: boolean; friend: any | null };
  onCloseSoloFriend: () => void;
  onMessageFriend: () => void;
  onInviteFriendToPlan: () => void;
  onPingFriend: () => void;

  // Venue Detail Modal
  venueDetailModal: { isOpen: boolean; venue: string; friendsAtVenue: any[] };
  onCloseVenueDetail: () => void;
  onJoinVenuePlan: () => void;
  onPingVenueFriends: () => void;

  // New Group Action Modal
  groupActionModal?: { isOpen: boolean; friends: any[]; venue: string; action: 'ping' | 'plan' };
  onCloseGroupAction?: () => void;
  onGroupChat?: () => void;
  onStartGroupPlan?: () => void;
}

const FriendsActionModals = ({
  inviteToPlanModal,
  onCloseInviteToPlan,
  onCreateNewPlan,
  friendGroupJoinModal,
  onCloseFriendGroupJoin,
  onJoinGroup,
  onPingGroup,
  attendeeListModal,
  onCloseAttendeeList,
  onMessageAll,
  onPingAll,
  soloFriendModal,
  onCloseSoloFriend,
  onMessageFriend,
  onInviteFriendToPlan,
  onPingFriend,
  venueDetailModal,
  onCloseVenueDetail,
  onJoinVenuePlan,
  onPingVenueFriends,
  groupActionModal,
  onCloseGroupAction,
  onGroupChat,
  onStartGroupPlan
}: FriendsActionModalsProps) => {
  return (
    <>
      <InviteToPlanModal
        isOpen={inviteToPlanModal.isOpen}
        onClose={onCloseInviteToPlan}
        selectedFriends={inviteToPlanModal.selectedFriends}
        onCreateNewPlan={onCreateNewPlan}
      />

      <FriendGroupJoinModal
        isOpen={friendGroupJoinModal.isOpen}
        onClose={onCloseFriendGroupJoin}
        groupFriends={friendGroupJoinModal.groupFriends}
        venue={friendGroupJoinModal.venue}
        onJoin={onJoinGroup}
        onPing={onPingGroup}
      />

      <AttendeeListModal
        isOpen={attendeeListModal.isOpen}
        onClose={onCloseAttendeeList}
        venue={attendeeListModal.venue}
        attendees={attendeeListModal.attendees}
        onMessageAll={onMessageAll}
        onPingAll={onPingAll}
      />

      <SoloFriendActionModal
        isOpen={soloFriendModal.isOpen}
        onClose={onCloseSoloFriend}
        friend={soloFriendModal.friend}
        onMessage={onMessageFriend}
        onInviteToPlan={onInviteFriendToPlan}
        onPing={onPingFriend}
      />

      <VenueDetailModal
        isOpen={venueDetailModal.isOpen}
        onClose={onCloseVenueDetail}
        venue={venueDetailModal.venue}
        friendsAtVenue={venueDetailModal.friendsAtVenue}
        onJoin={onJoinVenuePlan}
        onPing={onPingVenueFriends}
      />

      {/* New Group Action Modal */}
      {groupActionModal && (
        <GroupActionModal
          isOpen={groupActionModal.isOpen}
          onClose={onCloseGroupAction || (() => {})}
          friends={groupActionModal.friends}
          venue={groupActionModal.venue}
          action={groupActionModal.action}
          onPingGroup={onGroupChat || (() => {})}
          onStartPlan={onStartGroupPlan || (() => {})}
        />
      )}
    </>
  );
};

export default FriendsActionModals;
