
import React from 'react';
import { Navigation, NavigationOff } from 'lucide-react';
import { getFeatureFlag } from '@/utils/featureFlags';
import { useHideOnScroll } from '@/utils/useHideOnScroll';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  gpsActive: boolean;
  onToggleGPS: () => void;
}

const ChatHeader = ({ gpsActive, onToggleGPS }: ChatHeaderProps) => {
  const useUnifiedScrolling = getFeatureFlag('scrolling_header_unify_v1');
  const useStickyOnLoad = getFeatureFlag('chat_header_sticky_on_load_v1');
  const isVisible = useHideOnScroll(10, useStickyOnLoad ? 300 : 0);

  return (
    <div className={cn(
      `p-4 flex items-center justify-between border-b border-border bg-card ${
        useUnifiedScrolling ? 'h-16' : 'h-16'
      }`,
      useStickyOnLoad && "transition-transform duration-200 ease-out",
      useStickyOnLoad && !isVisible && "-translate-y-full"
    )}>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-cyan-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-lg font-bold text-white">N</span>
        </div>
        <div>
          <h1 className="font-bold text-lg text-foreground">Nova</h1>
          <p className="text-xs text-muted-foreground">Your AI Nightlife Concierge</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 pr-16">
        <button 
          onClick={onToggleGPS}
          className={`p-2 rounded-lg transition-colors ${
            gpsActive 
              ? 'text-green-500 bg-green-500/10 hover:bg-green-500/20' 
              : 'text-gray-400 bg-gray-400/10 hover:bg-gray-400/20'
          }`}
          title={gpsActive ? 'GPS Active' : 'GPS Inactive'}
        >
          {gpsActive ? <Navigation size={16} /> : <NavigationOff size={16} />}
        </button>
        <div className="w-2 h-2 bg-primary rounded-full pulse-glow"></div>
      </div>
    </div>
  );
};

export default ChatHeader;
