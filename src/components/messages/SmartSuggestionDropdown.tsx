
import React, { useState } from 'react';
import { MapPin, User, Calendar, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SmartSuggestion, SmartSuggestionGroups } from '@/types/smartLinking';

interface SmartSuggestionDropdownProps {
  suggestions: SmartSuggestionGroups;
  isVisible: boolean;
  onSelect: (suggestion: SmartSuggestion) => void;
  selectedIndex: number;
  query: string;
}

const SmartSuggestionDropdown = ({
  suggestions,
  isVisible,
  onSelect,
  selectedIndex,
  query
}: SmartSuggestionDropdownProps) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'venues' | 'friends' | 'plans'>('all');

  if (!isVisible) return null;

  const allSuggestions = [
    ...suggestions.venues,
    ...suggestions.friends,
    ...suggestions.plans
  ];

  const getFilteredSuggestions = () => {
    switch (activeCategory) {
      case 'venues': return suggestions.venues;
      case 'friends': return suggestions.friends;
      case 'plans': return suggestions.plans;
      default: return allSuggestions;
    }
  };

  const filteredSuggestions = getFilteredSuggestions();
  const hasResults = allSuggestions.length > 0;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'venue': return <MapPin size={16} className="text-purple-500" />;
      case 'friend': return <User size={16} className="text-teal-500" />;
      case 'plan': return <Calendar size={16} className="text-orange-500" />;
      default: return <Search size={16} className="text-muted-foreground" />;
    }
  };

  const getTagColor = (type: string) => {
    switch (type) {
      case 'venue': return 'purple';
      case 'friend': return 'blue';
      case 'plan': return 'orange';
      default: return 'default';
    }
  };

  return (
    <Card className="absolute bottom-full left-0 right-0 mb-2 bg-card border-border shadow-lg z-50 max-h-80 overflow-hidden">
      {/* Header with search info */}
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Search size={14} />
          <span>Smart linking for "{query}"</span>
        </div>
      </div>

      {/* Category tabs */}
      {hasResults && (
        <div className="flex border-b border-border bg-background">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeCategory === 'all' 
                ? 'bg-primary/10 text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({allSuggestions.length})
          </button>
          {suggestions.venues.length > 0 && (
            <button
              onClick={() => setActiveCategory('venues')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                activeCategory === 'venues' 
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              📍 Venues ({suggestions.venues.length})
            </button>
          )}
          {suggestions.friends.length > 0 && (
            <button
              onClick={() => setActiveCategory('friends')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                activeCategory === 'friends' 
                  ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-500' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              👤 Friends ({suggestions.friends.length})
            </button>
          )}
          {suggestions.plans.length > 0 && (
            <button
              onClick={() => setActiveCategory('plans')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                activeCategory === 'plans' 
                  ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              📝 Plans ({suggestions.plans.length})
            </button>
          )}
        </div>
      )}

      {/* Suggestions list */}
      <div className="max-h-48 overflow-y-auto">
        {!hasResults ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            <Search size={24} className="mx-auto mb-2 opacity-50" />
            <p>No suggestions found for "{query}"</p>
            <p className="text-xs mt-1">Try searching for venues, friends, or plans</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredSuggestions.map((suggestion, index) => {
              const globalIndex = allSuggestions.findIndex(s => s.id === suggestion.id && s.type === suggestion.type);
              const isSelected = selectedIndex === globalIndex;
              
              return (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  onClick={() => onSelect(suggestion)}
                  className={`
                    w-full text-left p-3 rounded-lg transition-colors mb-1 last:mb-0
                    ${isSelected 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-accent/50'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    {getIconForType(suggestion.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          @{suggestion.name}
                        </span>
                        <Badge 
                          variant={getTagColor(suggestion.type)} 
                          className="text-xs"
                        >
                          {suggestion.type}
                        </Badge>
                      </div>
                      {suggestion.subtitle && (
                        <div className="text-xs text-muted-foreground truncate">
                          {suggestion.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SmartSuggestionDropdown;
