
import React from 'react';
import FeedHeader from './feed/FeedHeader';
import FeedTabBar from './feed/FeedTabBar';
import FeedContent from './feed/FeedContent';
import TrendingCarousel from './feed/TrendingCarousel';
import FeedLayoutManager from './feed/FeedLayoutManager';
import FeedModalsProvider from './feed/FeedModalsProvider';
import BlastsFilterModal from './feed/BlastsFilterModal';
import { useFeedState } from './feed/FeedState';
import { useFeedHandlers } from './feed/FeedHandlers';
import { getFeatureFlag } from '@/utils/featureFlags';

const FeedView = () => {
  const state = useFeedState();
  const handlers = useFeedHandlers(state);
  const useUnifiedScrolling = getFeatureFlag('scrolling_header_unify_v1');

  const unreadActivityCount = state.liveActivityData.activities.filter(
    (a: any) => a.timeAgo.includes('min ago') || a.timeAgo === 'Just now'
  ).length;

  const handleTrendingEventClick = (eventId: number) => {
    console.log('Trending event clicked:', eventId);
  };

  const header = (
    <FeedHeader 
      sortBy={state.searchState.activeFilters.sortBy}
      setSortBy={(sortBy) => state.searchState.updateFilter('sortBy', sortBy)}
      onFilterClick={() => state.setIsFilterOpen(true)}
      currentView={state.liveActivityData.currentView}
      activeFilterCount={state.searchState.getActiveFilterCount()}
      onBlastsFilterClick={() => state.setIsBlastsFilterOpen(true)}
      activeBlastsFilterCount={state.getActiveBlastsFilterCount()}
      searchQuery={state.searchState.searchQuery}
      onSearchChange={state.searchState.setSearchQuery}
    />
  );

  const content = (
    <>
      {/* Tab Bar */}
      <div className={`px-4 py-2 border-b border-border ${useUnifiedScrolling ? 'sticky top-0 z-10 bg-background' : ''}`}>
        <FeedTabBar 
          currentView={state.liveActivityData.currentView}
          onViewChange={state.liveActivityData.setCurrentView}
          liveActivityCount={unreadActivityCount}
        />
      </div>

      {/* Trending Carousel - Show only on discover tab */}
      {state.liveActivityData.currentView === 'discover' && (
        <TrendingCarousel onEventClick={handleTrendingEventClick} />
      )}

      {/* Content */}
      <FeedContent
        currentView={state.liveActivityData.currentView}
        feedPosts={state.searchState.filteredPosts}
        blasts={state.filteredBlasts}
        activities={state.liveActivityData.activities}
        likedPosts={state.feedData.likedPosts}
        savedPosts={state.feedData.savedPosts}
        watchedPosts={state.feedData.watchedPosts}
        socialIntelligence={state.socialIntelligence}
        notificationSystem={state.notificationSystem}
        onLike={state.feedData.handleLike}
        onSave={state.feedData.handleSave}
        onWatch={state.feedData.handleWatch}
        onPostClick={handlers.handlePostClick}
        onCommentClick={handlers.handleCommentClick}
        onShareClick={handlers.handleShareClick}
        onCreatePost={handlers.handleCreatePost}
        onLiveActivityAction={handlers.handleLiveActivityAction}
        onBlastResponse={handlers.handleBlastResponse}
        searchQuery={state.searchState.searchQuery}
        onClearSearch={state.searchState.clearAllFilters}
      />
    </>
  );

  return (
    <>
      <FeedLayoutManager header={header} content={content} />
      
      <FeedModalsProvider
        isCreatePostOpen={state.isCreatePostOpen}
        setIsCreatePostOpen={state.setIsCreatePostOpen}
        isCommentModalOpen={state.isCommentModalOpen}
        setIsCommentModalOpen={state.setIsCommentModalOpen}
        isShareModalOpen={state.isShareModalOpen}
        setIsShareModalOpen={state.setIsShareModalOpen}
        isFilterOpen={state.isFilterOpen}
        setIsFilterOpen={state.setIsFilterOpen}
        isVenueDetailOpen={state.isVenueDetailOpen}
        setIsVenueDetailOpen={state.setIsVenueDetailOpen}
        selectedPost={state.selectedPost}
        setSelectedPost={state.setSelectedPost}
        searchState={state.searchState}
        feedData={state.feedData}
        currentView={state.liveActivityData.currentView}
        onCreatePostSubmit={handlers.handleCreatePostSubmit}
        onVenueJoin={handlers.handleVenueJoin}
        onVenueMessage={handlers.handleVenueMessage}
        onVenueShare={handlers.handleVenueShare}
      />

      {/* Blasts Filter Modal */}
      <BlastsFilterModal
        isOpen={state.isBlastsFilterOpen}
        onClose={() => state.setIsBlastsFilterOpen(false)}
        activeFilters={state.blastsFilters}
        onFilterToggle={state.handleBlastsFilterToggle}
        onClearAll={state.clearBlastsFilters}
      />
    </>
  );
};

export default FeedView;
