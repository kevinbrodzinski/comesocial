
import React from 'react';
import { getFeatureFlag } from '@/utils/featureFlags';
import PageWithScrollingHeader from './PageWithScrollingHeader';

interface LayoutManagerProps {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const LayoutManager = ({ header, children, className }: LayoutManagerProps) => {
  const useUnifiedScrolling = getFeatureFlag('scrolling_header_unify_v1');

  if (useUnifiedScrolling) {
    return (
      <div className={`flex flex-col h-screen bg-background ${className || ''}`}>
        <PageWithScrollingHeader header={header}>
          {children}
        </PageWithScrollingHeader>
      </div>
    );
  }

  // Fallback to original layout when feature flag is disabled
  return (
    <div className={`flex flex-col h-screen bg-background ${className || ''}`}>
      {header}
      <div className="flex-1 overflow-auto">
        <div className="pt-56 pb-32">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutManager;
