
import React from 'react';
import { getFeatureFlag } from '@/utils/featureFlags';

interface PageWithScrollingHeaderProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

const PageWithScrollingHeader = ({ header, children }: PageWithScrollingHeaderProps) => {
  const useUnifiedScrolling = getFeatureFlag('scrolling_header_unify_v1');

  if (!useUnifiedScrolling) {
    // Return children as-is when feature flag is disabled
    return <>{children}</>;
  }

  return (
    <main className="flex flex-col h-full">
      {/* Single scroll container with header inside */}
      <div className="flex-1 overflow-y-auto space-y-0">
        {header}
        {children}
      </div>
    </main>
  );
};

export default PageWithScrollingHeader;
