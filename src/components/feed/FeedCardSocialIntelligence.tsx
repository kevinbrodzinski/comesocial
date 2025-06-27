
import React from 'react';
import FriendAvatarCluster from '../social/FriendAvatarCluster';
import SocialBuzzBadge from '../social/SocialBuzzBadge';

interface FeedCardSocialIntelligenceProps {
  friendsAtVenue: any[];
  friendsHeadingHere: any[];
  venueMomentum: any;
}

const FeedCardSocialIntelligence = ({ 
  friendsAtVenue, 
  friendsHeadingHere, 
  venueMomentum 
}: FeedCardSocialIntelligenceProps) => {
  if (!friendsAtVenue.length && !friendsHeadingHere.length && !venueMomentum) {
    return null;
  }

  return (
    <div className="mb-3 space-y-2">
      {friendsAtVenue.length > 0 && (
        <div className="flex items-center space-x-2">
          <FriendAvatarCluster friends={friendsAtVenue} maxDisplay={3} size="sm" />
          <span className="text-xs text-muted-foreground">
            {friendsAtVenue.length === 1 
              ? `${friendsAtVenue[0].name} is here` 
              : `${friendsAtVenue.length} friends are here`
            }
          </span>
        </div>
      )}
      
      {friendsHeadingHere.length > 0 && (
        <div className="flex items-center space-x-2">
          <FriendAvatarCluster friends={friendsHeadingHere} maxDisplay={3} size="sm" showStatus />
          <span className="text-xs text-blue-600">
            {friendsHeadingHere.length === 1 
              ? `${friendsHeadingHere[0].name} is heading here` 
              : `${friendsHeadingHere.length} friends heading here`
            }
          </span>
        </div>
      )}

      {venueMomentum && (
        <SocialBuzzBadge momentum={venueMomentum} showFriendsConsidering />
      )}
    </div>
  );
};

export default FeedCardSocialIntelligence;
