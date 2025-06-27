
import React, { useLayoutEffect, useRef } from 'react';
import { Search, Heart, Bell, Filter, X, Plus, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SearchResultsDropdown from '../SearchResultsDropdown';
import MapFiltersModal from './MapFiltersModal';
import { useMessagesStore } from '@/messages/useMessagesStore';
import MessageCenterModal from './messages/MessageCenterModal';
import { isFeatureEnabled } from '@/utils/featureFlags';

interface MapHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFocused: boolean;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  onSearchResultSelect: (result: any) => void;
  onSearchQuickAction?: (result: any, action: 'view' | 'add' | 'start') => void;
  selectedFilters: string[];
  onToggleFilter: (filter: string) => void;
  crowdFilter: number[];
  setCrowdFilter: (filter: number[]) => void;
  vibeFilters: string[];
  onToggleVibeFilter: (vibe: string) => void;
  openNowOnly: boolean;
  setOpenNowOnly: (open: boolean) => void;
  distanceFilter: number;
  setDistanceFilter: (distance: number) => void;
  onResetFilters: () => void;
  onFavoritesClick: () => void;
  onNotificationClick: () => void;
  onMessagesClick: () => void;
  hasUnreadNotifications: boolean;
  filteredVenuesCount: number;
  totalVenuesCount: number;
  planningMode: boolean;
  onShowTemporaryPins?: (results: any[]) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

const MapHeader = ({
  searchQuery,
  setSearchQuery,
  searchFocused,
  onSearchFocus,
  onSearchBlur,
  onSearchResultSelect,
  onSearchQuickAction,
  selectedFilters,
  onToggleFilter,
  crowdFilter,
  setCrowdFilter,
  vibeFilters,
  onToggleVibeFilter,
  openNowOnly,
  setOpenNowOnly,
  distanceFilter,
  setDistanceFilter,
  onResetFilters,
  onFavoritesClick,
  onNotificationClick,
  onMessagesClick,
  hasUnreadNotifications,
  filteredVenuesCount,
  totalVenuesCount,
  planningMode,
  onShowTemporaryPins,
  searchInputRef
}: MapHeaderProps) => {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [messageCenterOpen, setMessageCenterOpen] = React.useState(false);
  const { threads } = useMessagesStore();
  const ref = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    function sync() {
      if (ref.current) {
        const h = ref.current.offsetHeight;
        document.documentElement.style.setProperty('--map-header-h', `${h}px`);
      }
    }
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);
  
  // Fixed filter detection logic - check against actual default values
  const hasActiveFilters = 
    !selectedFilters.includes('All') || // If 'All' is not selected, filters are active
    selectedFilters.length > 1 || // If more than just 'All' is selected
    crowdFilter[0] !== 0 || 
    crowdFilter[1] !== 100 || 
    vibeFilters.length > 0 || 
    openNowOnly || 
    distanceFilter !== 5; // Default distance is 5, not 0.5

  // Fixed badge count calculation
  const activeFilterCount = 
    (selectedFilters.includes('All') ? 0 : selectedFilters.length) +
    (crowdFilter[0] !== 0 || crowdFilter[1] !== 100 ? 1 : 0) +
    vibeFilters.length +
    (openNowOnly ? 1 : 0) +
    (distanceFilter !== 5 ? 1 : 0);

  // Calculate unread map messages count
  const mapUnreadCount = threads.filter(thread => 
    thread.context === 'map' && thread.unread
  ).length;

  const handleMessagesClick = () => {
    if (isFeatureEnabled('map_message_center_v1')) {
      setMessageCenterOpen(true);
    } else {
      onMessagesClick();
    }
  };

  return (
    <>
      <header
        ref={ref}
        className="w-full bg-background/95 backdrop-blur border-b border-border z-40 px-4 pt-3 pb-2"
      >
        {/* Planning Mode Banner */}
        {planningMode && (
          <div className="mb-3 bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Plus size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                Planning Mode Active - Search to add venues to your plan
              </span>
            </div>
            <Badge variant="default" className="animate-pulse">
              Building Plan
            </Badge>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              ref={searchInputRef}
              placeholder={planningMode ? "Search venues to add to your plan..." : "Search venues, bars, restaurants..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={onSearchFocus}
              onBlur={onSearchBlur}
              className={`pl-10 pr-4 h-12 text-base ${planningMode ? 'border-primary ring-1 ring-primary/20' : ''}`}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </Button>
            )}
          </div>

          <SearchResultsDropdown
            query={searchQuery}
            isVisible={searchFocused && searchQuery.length > 0}
            onResultSelect={onSearchResultSelect}
            onQuickAction={onSearchQuickAction}
            planningMode={planningMode}
            onShowTemporaryPins={onShowTemporaryPins}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant={hasActiveFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltersOpen(true)}
              className="relative"
            >
              <Filter size={16} className="mr-2" />
              Filters
              {hasActiveFilters && activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Venue Count */}
            <span className="text-sm text-muted-foreground">
              {filteredVenuesCount} of {totalVenuesCount} venues
            </span>
            <Button variant="ghost" size="sm" onClick={onFavoritesClick}>
              <Heart size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMessagesClick}
              className="relative"
            >
              <MessageCircle size={16} />
              {isFeatureEnabled('map_message_center_v1') && mapUnreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={onNotificationClick}
            >
              <Bell size={16} />
              {hasUnreadNotifications && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Active Filters:</span>
                {selectedFilters.filter(f => f !== 'All').map(filter => (
                  <Badge key={filter} variant="secondary" className="text-xs">
                    {filter}
                  </Badge>
                ))}
                {vibeFilters.map(vibe => (
                  <Badge key={vibe} variant="secondary" className="text-xs">
                    {vibe}
                  </Badge>
                ))}
                {openNowOnly && (
                  <Badge variant="secondary" className="text-xs">
                    Open Now
                  </Badge>
                )}
                {distanceFilter !== 5 && (
                  <Badge variant="secondary" className="text-xs">
                    {distanceFilter}km
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Filters Modal */}
      <MapFiltersModal
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        selectedFilters={selectedFilters}
        onToggleFilter={onToggleFilter}
        crowdFilter={crowdFilter}
        setCrowdFilter={setCrowdFilter}
        vibeFilters={vibeFilters}
        onToggleVibeFilter={onToggleVibeFilter}
        openNowOnly={openNowOnly}
        setOpenNowOnly={setOpenNowOnly}
        distanceFilter={distanceFilter}
        setDistanceFilter={setDistanceFilter}
        onResetFilters={onResetFilters}
      />

      {/* Map Message Center Modal */}
      {isFeatureEnabled('map_message_center_v1') && (
        <MessageCenterModal
          isOpen={messageCenterOpen}
          onClose={() => setMessageCenterOpen(false)}
        />
      )}
    </>
  );
};

export default MapHeader;
