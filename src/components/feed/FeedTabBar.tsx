
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Compass, Users, Zap } from 'lucide-react';
import { withFeatureFlag } from '@/utils/featureFlags';

interface FeedTabBarProps {
  currentView: 'discover' | 'blasts' | 'live';
  onViewChange: (view: 'discover' | 'blasts' | 'live') => void;
  liveActivityCount?: number;
}

const FeedTabBar = ({ currentView, onViewChange, liveActivityCount = 0 }: FeedTabBarProps) => {
  return (
    <div className={`flex items-center space-x-1 bg-muted/30 rounded-lg p-1 ${withFeatureFlag('contrast-pass-01', 'border border-foreground/20 shadow-md')}`}>
      <Button
        variant={currentView === 'discover' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('discover')}
        className="flex items-center space-x-1.5 transition-all relative flex-1 text-xs h-9"
      >
        <Compass size={14} />
        <span className="hidden xs:inline">Discover</span>
        <span className="xs:hidden">Disc</span>
      </Button>
      
      <Button
        variant={currentView === 'blasts' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('blasts')}
        className="flex items-center space-x-1.5 transition-all relative flex-1 text-xs h-9"
      >
        <Users size={14} />
        <span className="hidden xs:inline">Who's Down?</span>
        <span className="xs:hidden">Down?</span>
      </Button>
      
      <Button
        variant={currentView === 'live' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('live')}
        className="flex items-center space-x-1.5 transition-all relative flex-1 text-xs h-9"
      >
        <Zap size={14} />
        <span className="hidden xs:inline">Live Updates</span>
        <span className="xs:hidden">Live</span>
        {liveActivityCount > 0 && (
          <Badge 
            variant="destructive" 
            className="ml-1 px-1.5 py-0.5 text-[10px] min-w-[18px] h-4 flex items-center justify-center"
          >
            {liveActivityCount > 9 ? '9+' : liveActivityCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default FeedTabBar;
