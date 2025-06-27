
import React from 'react';
import { getFeatureFlag } from '@/utils/featureFlags';
import PageWithScrollingHeader from '../layout/PageWithScrollingHeader';

interface FeedLayoutManagerProps {
  header: React.ReactNode;
  content: React.ReactNode;
}

const FeedLayoutManager = ({ header, content }: FeedLayoutManagerProps) => {
  const useUnifiedScrolling = getFeatureFlag('scrolling_header_unify_v1');

  if (useUnifiedScrolling) {
    return (
      <div className="flex flex-col h-full bg-background">
        <PageWithScrollingHeader header={header}>
          {content}
        </PageWithScrollingHeader>
      </div>
    );
  }

  // Fallback to original layout when feature flag is disabled
  return (
    <div className="flex flex-col h-full bg-background">
      {header}
      <div className="flex-1 overflow-auto">
        {content}
      </div>
    </div>
  );
};

export default FeedLayoutManager;
