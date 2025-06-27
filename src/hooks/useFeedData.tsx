
import { useState } from 'react';
import { feedPosts as initialFeedPosts } from '../data/feedData';
import { toast } from '@/hooks/use-toast';

export const useFeedData = () => {
  const [feedPosts, setFeedPosts] = useState(initialFeedPosts || []);
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
  const [savedPosts, setSavedPosts] = useState<{ [key: number]: boolean }>({});
  const [watchedPosts, setWatchedPosts] = useState<{ [key: number]: boolean }>({});
  const [sortBy, setSortBy] = useState<'distance' | 'buzz' | 'friends'>('buzz');

  const handleLike = (postId: number) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleSave = (postId: number) => {
    setSavedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleWatch = (postId: number) => {
    const isWatching = watchedPosts[postId];
    
    setWatchedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    // Show appropriate toast message
    if (!isWatching) {
      const post = feedPosts.find(p => p.id === postId);
      toast({
        title: "Added to Watchlist",
        description: `We'll notify you about updates to ${post?.venue || 'this event'}`,
      });
    } else {
      toast({
        title: "Removed from Watchlist",
        description: "You'll no longer receive notifications for this event",
      });
    }
  };

  return {
    feedPosts,
    setFeedPosts,
    likedPosts,
    savedPosts,
    watchedPosts,
    sortBy,
    setSortBy,
    handleLike,
    handleSave,
    handleWatch
  };
};
