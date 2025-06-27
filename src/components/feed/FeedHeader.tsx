
import React from 'react';
import { Filter, Zap, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getFeatureFlag } from '@/utils/featureFlags';
import FeedSimpleSearch from './FeedSimpleSearch';

interface FeedHeaderProps {
  sortBy: 'distance' | 'buzz' | 'friends';
  setSortBy: (sort: 'distance' | 'buzz' | 'friends') => void;
  onFilterClick: () => void;
  currentView?: 'discover' | 'blasts' | 'live';
  activeFilterCount?: number;
  onBlastsFilterClick?: () => void;
  activeBlastsFilterCount?: number;
  // Search props
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const FeedHeader = ({ 
  sortBy, 
  setSortBy, 
  onFilterClick, 
  currentView = 'discover',
  activeFilterCount = 0,
  onBlastsFilterClick,
  activeBlastsFilterCount = 0,
  searchQuery = '',
  onSearchChange = () => {}
}: FeedHeaderProps) => {
  const useUnifiedScrolling = getFeatureFlag('scrolling_header_unify_v1');

  const getSortLabel = () => {
    switch (sortBy) {
      case 'distance': return 'Distance';
      case 'buzz': return 'Buzz Level';
      case 'friends': return 'Friends Here';
      default: return 'Buzz Level';
    }
  };

  const handleUserProfileClick = () => {
    console.log('User profile clicked');
  };

  const getHeaderContent = () => {
    if (currentView === 'live') {
      return {
        title: 'Live Updates',
        subtitle: 'Real-time activity from your friends and watchlist',
        icon: <Zap size={20} className="text-primary" />
      };
    }
    if (currentView === 'blasts') {
      return {
        title: "Who's Down?",
        subtitle: 'Connect with friends for spontaneous plans',
        icon: <Zap size={20} className="text-orange-600" />
      };
    }
    return {
      title: 'Nightlife Feed',
      subtitle: 'Live updates from your city\'s hotspots',
      icon: <Compass size={20} className="text-primary" />
    };
  };

  const headerContent = getHeaderContent();

  return (
    <div className={`p-4 border-b border-border bg-card/50 backdrop-blur-sm ${
      useUnifiedScrolling ? '' : 'sticky top-0 z-10'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {headerContent.icon}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{headerContent.title}</h1>
            <p className="text-sm text-muted-foreground font-medium">
              {headerContent.subtitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUserProfileClick}
            className="p-2 hover:bg-primary/10 transition-colors"
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </Button>
          
          {/* Filter button for discover view */}
          {currentView === 'discover' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterClick}
              className="flex items-center space-x-1 hover:bg-primary/10 hover:border-primary/30 transition-all relative"
            >
              <Filter size={14} />
              <span className="text-xs">{getSortLabel()}</span>
              {activeFilterCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 px-1 py-0 text-[10px] min-w-[16px] h-4 flex items-center justify-center"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Filter button for blasts view */}
          {currentView === 'blasts' && onBlastsFilterClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBlastsFilterClick}
              className="flex items-center space-x-1 hover:bg-primary/10 hover:border-primary/30 transition-all relative"
            >
              <Filter size={14} />
              <span className="text-xs">Filter</span>
              {activeBlastsFilterCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 px-1 py-0 text-[10px] min-w-[16px] h-4 flex items-center justify-center"
                >
                  {activeBlastsFilterCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Search Bar - only show on discover tab */}
      {currentView === 'discover' && (
        <div className="mb-2">
          <FeedSimpleSearch
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            activeFilters={activeFilterCount}
            onOpenFilters={onFilterClick}
          />
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        {currentView === 'live' 
          ? 'Stay connected with your crew\'s nightlife moves'
          : currentView === 'blasts'
          ? 'Send a blast to rally your friends for tonight'
          : 'Tap to join the scene. See who else is there.'
        }
      </p>
    </div>
  );
};

export default FeedHeader;
