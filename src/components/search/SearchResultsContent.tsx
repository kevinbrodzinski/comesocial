
import React from 'react';
import { MapPin, Tag, Navigation, Calendar, Building } from 'lucide-react';
import SearchResultItem from './SearchResultItem';

interface SearchResult {
  id: string;
  type: 'venue' | 'tag' | 'area' | 'plan' | 'place' | 'fallback';
  name: string;
  subtitle?: string;
  icon: React.ReactNode;
  placeData?: any;
  fallbackData?: any;
}

interface SearchResultsContentProps {
  isLoading: boolean;
  stableResults: SearchResult[];
  googleResults: SearchResult[];
  fallbackResults: SearchResult[];
  planningMode: boolean;
  onResultSelect: (result: SearchResult) => void;
  onQuickAction: (result: SearchResult, action: 'view' | 'add' | 'start', e: React.MouseEvent) => void;
}

const SearchResultsContent = ({
  isLoading,
  stableResults,
  googleResults,
  fallbackResults,
  planningMode,
  onResultSelect,
  onQuickAction
}: SearchResultsContentProps) => {
  const hasResults = stableResults.length > 0 || googleResults.length > 0 || fallbackResults.length > 0;

  if (isLoading) {
    return (
      <div className="p-3 text-center text-muted-foreground">
        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        Searching venues...
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="p-3 text-center text-muted-foreground">
        <MapPin size={20} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No venues found</p>
        <p className="text-xs opacity-75">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {/* Planning Mode Header */}
      {planningMode && hasResults && (
        <div className="p-2 bg-primary/5 border-b border-primary/20 text-center">
          <p className="text-xs text-primary font-medium">
            Tap any venue to add it to your plan
          </p>
        </div>
      )}

      {/* Stable Results (App data) */}
      {stableResults.length > 0 && (
        <div>
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/50">
            Local Venues
          </div>
          {stableResults.map((result) => (
            <SearchResultItem
              key={`stable-${result.id}`}
              result={result}
              planningMode={planningMode}
              onResultSelect={onResultSelect}
              onQuickAction={onQuickAction}
            />
          ))}
        </div>
      )}

      {/* Google Places Results */}
      {googleResults.length > 0 && (
        <div>
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/50">
            Nearby Places
          </div>
          {googleResults.map((result) => (
            <SearchResultItem
              key={`google-${result.id}`}
              result={result}
              planningMode={planningMode}
              onResultSelect={onResultSelect}
              onQuickAction={onQuickAction}
            />
          ))}
        </div>
      )}

      {/* Fallback Results */}
      {fallbackResults.length > 0 && (
        <div>
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/50">
            Popular Venues
          </div>
          {fallbackResults.map((result) => (
            <SearchResultItem
              key={`fallback-${result.id}`}
              result={result}
              planningMode={planningMode}
              onResultSelect={onResultSelect}
              onQuickAction={onQuickAction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsContent;
