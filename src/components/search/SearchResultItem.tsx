
import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SearchResultActions from './SearchResultActions';

interface SearchResult {
  id: string;
  type: 'venue' | 'tag' | 'area' | 'plan' | 'place' | 'fallback';
  name: string;
  subtitle?: string;
  icon: React.ReactNode;
  placeData?: any;
  fallbackData?: any;
}

interface SearchResultItemProps {
  result: SearchResult;
  planningMode: boolean;
  onResultSelect: (result: SearchResult) => void;
  onQuickAction: (result: SearchResult, action: 'view' | 'add' | 'start', e: React.MouseEvent) => void;
}

const SearchResultItem = ({ 
  result, 
  planningMode, 
  onResultSelect, 
  onQuickAction 
}: SearchResultItemProps) => {
  const getBadgeText = () => {
    if (result.type === 'place' && result.placeData?.rating) {
      return `⭐ ${result.placeData.rating}`;
    }
    if (result.type === 'fallback' && result.fallbackData?.distance) {
      return result.fallbackData.distance;
    }
    return result.type === 'place' ? 'New' : 'Nearby';
  };

  return (
    <div
      className="p-3 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors border-b border-border/50 last:border-b-0"
      onClick={() => onResultSelect(result)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {result.icon}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {result.name}
            </p>
            {result.subtitle && (
              <p className="text-xs text-muted-foreground truncate">
                {result.subtitle}
              </p>
            )}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {getBadgeText()}
        </Badge>
      </div>
      
      {/* Always show action buttons, but modify them for planning mode */}
      <SearchResultActions
        result={result}
        onQuickAction={onQuickAction}
        planningMode={planningMode}
      />
    </div>
  );
};

export default SearchResultItem;
