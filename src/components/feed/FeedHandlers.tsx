
import { enhancedFeedPosts } from '../../data/enhancedFeedData';

export const useFeedHandlers = (state: any) => {
  const {
    setSelectedPost,
    setIsVenueDetailOpen,
    setIsCommentModalOpen,
    setIsShareModalOpen,
    setIsCreatePostOpen,
    feedData,
    liveActivityData,
    notificationSystem,
    setBlasts
  } = state;

  const handlePostClick = (post: any) => {
    // Find enhanced data for this post
    const enhancedPost = enhancedFeedPosts.find(p => p.id === post.id) || post;
    setSelectedPost(enhancedPost);
    setIsVenueDetailOpen(true);
  };

  const handleCommentClick = (post: any) => {
    setSelectedPost(post);
    setIsCommentModalOpen(true);
  };

  const handleShareClick = (post: any) => {
    setSelectedPost(post);
    setIsShareModalOpen(true);
  };

  const handleCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  const handleCreatePostSubmit = (postData: any) => {
    if (liveActivityData.currentView === 'blasts') {
      // Add to blasts
      setBlasts((prev: any) => [postData, ...prev]);
    } else {
      // Add to feed posts
      feedData.setFeedPosts((prev: any) => [postData, ...prev]);
    }
  };

  const handleLiveActivityAction = (activityId: number) => {
    console.log('Live activity action:', activityId);
  };

  const handleBlastResponse = (blastId: number, response: 'join' | 'maybe') => {
    setBlasts((prev: any) => prev.map((blast: any) => {
      if (blast.id === blastId) {
        const updatedBlast = { ...blast };
        if (response === 'join') {
          if (!updatedBlast.rsvpList.includes('You')) {
            updatedBlast.rsvpList = [...updatedBlast.rsvpList, 'You'];
            updatedBlast.responses = [...updatedBlast.rsvpList];
          }
          // Remove from maybe list if present
          updatedBlast.maybeList = updatedBlast.maybeList.filter((name: string) => name !== 'You');
        } else {
          if (!updatedBlast.maybeList.includes('You')) {
            updatedBlast.maybeList = [...updatedBlast.maybeList, 'You'];
          }
          // Remove from RSVP list if present
          updatedBlast.rsvpList = updatedBlast.rsvpList.filter((name: string) => name !== 'You');
          updatedBlast.responses = [...updatedBlast.rsvpList];
        }
        return updatedBlast;
      }
      return blast;
    }));

    console.log('Blast response:', blastId, response);
    notificationSystem.showNotification({
      id: Date.now().toString(),
      type: 'friend-checkin',
      title: response === 'join' ? "You're in! 🎉" : "Maybe next time! 👍",
      message: response === 'join' ? "We'll keep you updated on the plan" : "Your response has been noted",
      urgency: 'low',
      timestamp: new Date(),
      autoExpire: 3
    });
  };

  const handleVenueJoin = () => {
    notificationSystem.showNotification({
      id: Date.now().toString(),
      type: 'friend-checkin',
      title: "Event Joined! 🎉",
      message: "You're now part of this event. We'll keep you updated!",
      urgency: 'low',
      timestamp: new Date(),
      autoExpire: 3
    });
    setIsVenueDetailOpen(false);
  };

  const handleVenueMessage = () => {
    console.log('Message friends about venue');
    setIsVenueDetailOpen(false);
  };

  const handleVenueShare = () => {
    console.log('Share venue');
    setIsVenueDetailOpen(false);
  };

  return {
    handlePostClick,
    handleCommentClick,
    handleShareClick,
    handleCreatePost,
    handleCreatePostSubmit,
    handleLiveActivityAction,
    handleBlastResponse,
    handleVenueJoin,
    handleVenueMessage,
    handleVenueShare
  };
};
