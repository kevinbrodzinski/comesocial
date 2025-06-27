
import React, { useMemo, useCallback, useState } from 'react';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FriendRequestCard from './FriendRequestCard';
import FriendRequestProfileSheet from './FriendRequestProfileSheet';
import { FriendRequest } from '../../services/FriendRequestService';

interface FriendRequestsSectionProps {
  friendRequests: any;
  searchQuery: string;
  onFriendProfileOpen: (friend: any) => void;
}

const FriendRequestsSection = React.memo(({
  friendRequests,
  searchQuery,
  onFriendProfileOpen
}: FriendRequestsSectionProps) => {
  const [selectedRequest, setSelectedRequest] = useState<FriendRequest | null>(null);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);

  const handleFriendRequestProfileClick = useCallback((request: FriendRequest) => {
    setSelectedRequest(request);
    setProfileSheetOpen(true);
  }, []);

  const handleCloseProfileSheet = useCallback(() => {
    setProfileSheetOpen(false);
    setSelectedRequest(null);
  }, []);

  const handleAcceptRequest = useCallback(() => {
    if (selectedRequest) {
      friendRequests.acceptRequest(selectedRequest.id);
      handleCloseProfileSheet();
    }
  }, [selectedRequest, friendRequests, handleCloseProfileSheet]);

  const handleDeclineRequest = useCallback(() => {
    if (selectedRequest) {
      friendRequests.declineRequest(selectedRequest.id);
      handleCloseProfileSheet();
    }
  }, [selectedRequest, friendRequests, handleCloseProfileSheet]);

  const shouldShowFriendRequests = useMemo(() => 
    friendRequests?.incomingRequests?.length > 0 && !searchQuery,
    [friendRequests?.incomingRequests?.length, searchQuery]
  );

  if (!shouldShowFriendRequests) {
    return null;
  }

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Users size={14} className="text-primary" />
            <span className="text-sm font-medium">Friend Requests</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {friendRequests.incomingRequests.length}
          </Badge>
        </div>
        <div className="space-y-1">
          {friendRequests.incomingRequests.slice(0, 3).map((request: any) => (
            <FriendRequestCard
              key={request.id}
              request={request}
              onAccept={() => friendRequests.acceptRequest(request.id)}
              onDecline={() => friendRequests.declineRequest(request.id)}
              onProfileClick={handleFriendRequestProfileClick}
            />
          ))}
          {friendRequests.incomingRequests.length > 3 && (
            <div className="text-center pt-1">
              <button className="text-xs text-primary hover:underline">
                View all {friendRequests.incomingRequests.length} requests
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Friend Request Profile Sheet */}
      <FriendRequestProfileSheet
        isOpen={profileSheetOpen}
        onClose={handleCloseProfileSheet}
        request={selectedRequest}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
        onMessage={() => {
          // Handle message action - could integrate with messaging system
          console.log('Message friend request:', selectedRequest?.friendName);
        }}
      />
    </>
  );
});

FriendRequestsSection.displayName = 'FriendRequestsSection';

export default FriendRequestsSection;
