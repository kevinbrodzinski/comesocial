
import React from 'react';
import NotificationCenter from '../notifications/NotificationCenter';
import FeedModals from './FeedModals';
import FeedFilterModal from '../FeedFilterModal';
import EnhancedVenueDetailModal from './EnhancedVenueDetailModal';

interface FeedModalsProviderProps {
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  isCommentModalOpen: boolean;
  setIsCommentModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  isVenueDetailOpen: boolean;
  setIsVenueDetailOpen: (open: boolean) => void;
  selectedPost: any;
  setSelectedPost: (post: any) => void;
  searchState: any;
  feedData: any;
  currentView: 'discover' | 'blasts' | 'live';
  onCreatePostSubmit: (post: any) => void;
  onVenueJoin: (venue: any) => void;
  onVenueMessage: (venue: any) => void;
  onVenueShare: (venue: any) => void;
}

const FeedModalsProvider = ({
  isCreatePostOpen,
  setIsCreatePostOpen,
  isCommentModalOpen,
  setIsCommentModalOpen,
  isShareModalOpen,
  setIsShareModalOpen,
  isFilterOpen,
  setIsFilterOpen,
  isVenueDetailOpen,
  setIsVenueDetailOpen,
  selectedPost,
  setSelectedPost,
  searchState,
  feedData,
  currentView,
  onCreatePostSubmit,
  onVenueJoin,
  onVenueMessage,
  onVenueShare
}: FeedModalsProviderProps) => {
  return (
    <>
      <NotificationCenter />

      <FeedModals
        isCreatePostOpen={isCreatePostOpen}
        setIsCreatePostOpen={setIsCreatePostOpen}
        isFilterOpen={false}
        setIsFilterOpen={() => {}}
        isCommentModalOpen={isCommentModalOpen}
        setIsCommentModalOpen={setIsCommentModalOpen}
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        onCreatePost={onCreatePostSubmit}
        currentView={currentView}
      />

      <FeedFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={searchState.activeFilters}
        onUpdateFilter={searchState.updateFilter}
        onClearAll={searchState.clearAllFilters}
        activeFilterCount={searchState.getActiveFilterCount()}
      />

      <EnhancedVenueDetailModal
        isOpen={isVenueDetailOpen}
        onClose={() => setIsVenueDetailOpen(false)}
        venue={selectedPost}
        onJoin={() => onVenueJoin(selectedPost)}
        onWatch={() => feedData.handleWatch(selectedPost?.id)}
        onMessage={() => onVenueMessage(selectedPost)}
        onShare={() => onVenueShare(selectedPost)}
      />
    </>
  );
};

export default FeedModalsProvider;
