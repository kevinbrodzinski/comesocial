
import React from 'react';
import CommentModal from '../CommentModal';
import FeedFilterModal from '../FeedFilterModal';
import ShareModal from '../ShareModal';
import CreatePostModal from '../CreatePostModal';

interface FeedModalsProps {
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  isCommentModalOpen: boolean;
  setIsCommentModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  selectedPost: any;
  setSelectedPost: (post: any) => void;
  onCreatePost: (postData: any) => void;
  currentView?: 'discover' | 'blasts' | 'live';
  planData?: any;
  // Add filter-related props
  filters?: any;
  onUpdateFilter?: (key: string, value: any) => void;
  onClearAllFilters?: () => void;
  activeFilterCount?: number;
}

const FeedModals = ({
  isCreatePostOpen,
  setIsCreatePostOpen,
  isFilterOpen,
  setIsFilterOpen,
  isCommentModalOpen,
  setIsCommentModalOpen,
  isShareModalOpen,
  setIsShareModalOpen,
  selectedPost,
  setSelectedPost,
  onCreatePost,
  currentView,
  planData,
  filters,
  onUpdateFilter,
  onClearAllFilters,
  activeFilterCount
}: FeedModalsProps) => {
  return (
    <>
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onCreatePost={onCreatePost}
        currentView={currentView}
        planData={planData}
      />
      
      <FeedFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters || {}}
        onUpdateFilter={onUpdateFilter || (() => {})}
        onClearAll={onClearAllFilters || (() => {})}
        activeFilterCount={activeFilterCount || 0}
      />
      
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post={selectedPost || { id: 0, venue: '', friend: '', avatar: '' }}
      />
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        post={selectedPost}
      />
    </>
  );
};

export default FeedModals;
