
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeedCard from './FeedCard';
import EmptyFeedState from './EmptyFeedState';
import LiveActivityCard from './LiveActivityCard';
import EmptyBlastsState from './EmptyBlastsState';
import BlastCard from './BlastCard';
import TimingSuggestion from '../notifications/TimingSuggestion';

interface FeedContentProps {
  currentView: 'discover' | 'blasts' | 'live';
  feedPosts: any[];
  blasts: any[];
  activities: any[];
  likedPosts: { [key: number]: boolean };
  savedPosts: { [key: number]: boolean };
  watchedPosts: { [key: number]: boolean };
  socialIntelligence: any;
  notificationSystem: any;
  onLike: (id: number) => void;
  onSave: (id: number) => void;
  onWatch: (id: number) => void;
  onPostClick: (post: any) => void;
  onCommentClick: (post: any) => void;
  onShareClick: (post: any) => void;
  onCreatePost: () => void;
  onLiveActivityAction: (id: number) => void;
  onBlastResponse: (id: number, response: 'join' | 'maybe') => void;
  // Search props
  searchQuery?: string;
  onClearSearch?: () => void;
}

const FeedContent = ({
  currentView,
  feedPosts,
  blasts,
  activities,
  likedPosts,
  savedPosts,
  watchedPosts,
  socialIntelligence,
  notificationSystem,
  onLike,
  onSave,
  onWatch,
  onPostClick,
  onCommentClick,
  onShareClick,
  onCreatePost,
  onLiveActivityAction,
  onBlastResponse,
  searchQuery = '',
  onClearSearch = () => {}
}: FeedContentProps) => {
  const showTimingSuggestion = Math.random() > 0.7; // 30% chance to show
  const timingSuggestion = {
    venue: 'Sky Lounge',
    currentCrowd: 65,
    peakTime: '10:30 PM',
    recommendation: 'go-now' as const,
    friendsPresent: 2
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 scroll-smooth">
      <div className="max-w-md mx-auto">
        {/* Smart Timing Suggestion - shows occasionally */}
        {currentView === 'discover' && showTimingSuggestion && (
          <div className="p-4 pb-2">
            <TimingSuggestion
              venue={timingSuggestion.venue}
              currentCrowd={timingSuggestion.currentCrowd}
              peakTime={timingSuggestion.peakTime}
              recommendation={timingSuggestion.recommendation}
              friendsPresent={timingSuggestion.friendsPresent}
              onAction={() => {
                console.log('Timing suggestion action:', timingSuggestion.venue);
                notificationSystem.showNotification({
                  id: Date.now().toString(),
                  type: 'optimal-timing',
                  title: '🎯 Great choice!',
                  message: `Heading to ${timingSuggestion.venue} at the perfect time!`,
                  venue: timingSuggestion.venue,
                  urgency: 'low',
                  timestamp: new Date(),
                  autoExpire: 3
                });
              }}
            />
          </div>
        )}

        {currentView === 'discover' ? (
          // Discover Feed
          <div className="p-4">
            {feedPosts.length === 0 ? (
              searchQuery ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-2">No venues found</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Try adjusting your search or filters
                  </div>
                  <Button variant="outline" onClick={onClearSearch}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                <EmptyFeedState onCreatePost={onCreatePost} />
              )
            ) : (
              <div className="space-y-6 snap-y snap-mandatory">
                {feedPosts.map((post) => (
                  <div key={post.id} className="snap-start">
                    <FeedCard
                      post={post}
                      isLiked={likedPosts[post.id] || false}
                      isSaved={savedPosts[post.id] || false}
                      isWatched={watchedPosts[post.id] || false}
                      onLike={() => onLike(post.id)}
                      onSave={() => onSave(post.id)}
                      onWatch={() => onWatch(post.id)}
                      onComment={() => onCommentClick(post)}
                      onShare={() => onShareClick(post)}
                      onPostClick={() => onPostClick(post)}
                      socialIntelligence={socialIntelligence}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : currentView === 'blasts' ? (
          // Who's Down? Feed
          <div className="p-4">
            {blasts.length === 0 ? (
              <EmptyBlastsState onCreateBlast={onCreatePost} />
            ) : (
              <div className="space-y-4">
                {blasts.map((blast) => (
                  <BlastCard
                    key={blast.id}
                    blast={blast}
                    onResponse={onBlastResponse}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Live Updates Feed
          <div className="space-y-4 p-4">
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-2">No live updates</div>
                <div className="text-sm text-muted-foreground">
                  Check back when your friends are out!
                </div>
              </div>
            ) : (
              activities.map((activity) => (
                <LiveActivityCard
                  key={activity.id}
                  activity={activity}
                  onJoinAction={() => onLiveActivityAction(activity.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Floating Create Post Button - show on discover and blasts tabs */}
      {(currentView === 'discover' || currentView === 'blasts') && (
        <Button
          size="lg"
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 hover:scale-110 transition-all z-40"
          onClick={onCreatePost}
        >
          <Plus size={24} />
        </Button>
      )}
    </div>
  );
};

export default FeedContent;
