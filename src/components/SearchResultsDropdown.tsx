
import React from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getFallbackVenueCoordinates } from '../utils/coordinateUtils';
import SearchResultsContent from './search/SearchResultsContent';
import { useSearchResults } from './search/useSearchResults';

interface SearchResult {
  id: string;
  type: 'venue' | 'tag' | 'area' | 'plan' | 'place' | 'fallback';
  name: string;
  subtitle?: string;
  icon: React.ReactNode;
  placeData?: any;
  fallbackData?: any;
}

interface SearchResultsDropdownProps {
  query: string;
  isVisible: boolean;
  onResultSelect: (result: SearchResult) => void;
  onQuickAction?: (result: SearchResult, action: 'view' | 'add' | 'start') => void;
  planningMode?: boolean;
  onShowTemporaryPins?: (results: SearchResult[]) => void;
}

const SearchResultsDropdown = ({ 
  query, 
  isVisible, 
  onResultSelect, 
  onQuickAction,
  planningMode = false,
  onShowTemporaryPins
}: SearchResultsDropdownProps) => {
  const { toast } = useToast();
  const { googleResults, fallbackResults, stableResults, isLoading } = useSearchResults(query, onShowTemporaryPins);

  const handleQuickAction = (result: SearchResult, action: 'view' | 'add' | 'start', e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAction?.(result, action);
  };

  if (!isVisible || !query.trim()) return null;

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 bg-card border-border shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="p-2">
        <SearchResultsContent
          isLoading={isLoading}
          stableResults={stableResults}
          googleResults={googleResults}
          fallbackResults={fallbackResults}
          planningMode={planningMode}
          onResultSelect={onResultSelect}
          onQuickAction={handleQuickAction}
        />
      </div>
    </Card>
  );
};

export default SearchResultsDropdown;
