
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import UserProfileModal from '../UserProfileModal';
import EventJoinModal from './EventJoinModal';
import FeedCardHeader from './FeedCardHeader';
import FeedCardContent from './FeedCardContent';
import FeedCardVenueImage from './FeedCardVenueImage';
import FeedCardActionFooter from './FeedCardActionFooter';

interface FeedPost {
  id: number;
  venue: string;
  type: string;
  vibe: string;
  image: string;
  crowdLevel: number;
  distance: string;
  timePosted: string;
  likes: number;
  comments: number;
  friend: string;
  friendAvatar: string;
  caption: string;
}

interface FeedCardProps {
  post: FeedPost;
  isLiked: boolean;
  isSaved: boolean;
  isWatched: boolean;
  onLike: () => void;
  onSave: () => void;
  onWatch: () => void;
  onComment: () => void;
  onShare: () => void;
  onPostClick: () => void;
  socialIntelligence?: any;
}

const FeedCard = ({
  post,
  isLiked,
  isSaved,
  isWatched,
  onLike,
  onSave,
  onWatch,
  onComment,
  onShare,
  onPostClick,
  socialIntelligence
}: FeedCardProps) => {
  const [isCrowdTooltipOpen, setIsCrowdTooltipOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const handleCrowdClick = () => {
    setIsCrowdTooltipOpen(!isCrowdTooltipOpen);
  };

  const handleUserClick = () => {
    setIsUserProfileOpen(true);
  };

  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag);
  };

  const handleJoin = () => {
    setIsJoinModalOpen(true);
  };

  const handleVenueClick = () => {
    onPostClick();
  };

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const friendsAtVenue = socialIntelligence?.getFriendsAtVenue(post.id) || [];
  const friendsHeadingHere = socialIntelligence?.getFriendsHeadingToVenue(post.id) || [];
  const venueMomentum = socialIntelligence?.getVenueMomentumData(post.id);

  return (
    <>
      <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/10">
        {/* Post Header */}
        <div className="p-4 pb-3">
          <FeedCardHeader
            friend={post.friend}
            friendAvatar={post.friendAvatar}
            timePosted={post.timePosted}
            crowdLevel={post.crowdLevel}
            onUserClick={handleUserClick}
            onCrowdClick={handleCrowdClick}
            onStopPropagation={handleStopPropagation}
            isCrowdTooltipOpen={isCrowdTooltipOpen}
          />

          <FeedCardContent
            venue={post.venue}
            type={post.type}
            vibe={post.vibe}
            distance={post.distance}
            caption={post.caption}
            friendsAtVenue={friendsAtVenue}
            friendsHeadingHere={friendsHeadingHere}
            venueMomentum={venueMomentum}
            onVenueClick={handleVenueClick}
            onTagClick={handleTagClick}
          />
        </div>

        {/* Venue Image */}
        <FeedCardVenueImage
          image={post.image}
          venue={post.venue}
          crowdLevel={post.crowdLevel}
        />

        {/* Action Footer */}
        <FeedCardActionFooter
          post={post}
          isLiked={isLiked}
          isSaved={isSaved}
          isWatched={isWatched}
          onLike={onLike}
          onSave={onSave}
          onWatch={onWatch}
          onComment={onComment}
          onShare={onShare}
          onJoin={handleJoin}
          onStopPropagation={handleStopPropagation}
        />
      </Card>

      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={{
          username: post.friend,
          avatar: post.friendAvatar,
          mutualFriends: Math.floor(Math.random() * 10) + 1,
          lastSeen: post.timePosted
        }}
      />

      <EventJoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        post={post}
        onJoin={() => {
          setIsJoinModalOpen(false);
          console.log('Joined event:', post.venue);
        }}
        onWatch={() => {
          setIsJoinModalOpen(false);
          onWatch();
        }}
      />
    </>
  );
};

export default FeedCard;
