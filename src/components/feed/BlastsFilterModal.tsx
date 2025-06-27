
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BlastsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: {
    activityTypes: string[];
    timeFrames: string[];
    groupSizes: string[];
    locationPreferences: string[];
  };
  onFilterToggle: (category: string, value: string) => void;
  onClearAll: () => void;
}

const BlastsFilterModal = ({
  isOpen,
  onClose,
  activeFilters,
  onFilterToggle,
  onClearAll
}: BlastsFilterModalProps) => {
  if (!isOpen) return null;

  const filterSections = [
    {
      title: 'Activity Type',
      key: 'activityTypes',
      options: [
        { value: 'drinks', label: 'Drinks', emoji: '🍸' },
        { value: 'dinner', label: 'Dinner', emoji: '🍽️' },
        { value: 'clubbing', label: 'Clubbing', emoji: '🎵' },
        { value: 'rooftop', label: 'Rooftop', emoji: '🏙️' },
        { value: 'sports-bar', label: 'Sports Bar', emoji: '⚽' },
        { value: 'karaoke', label: 'Karaoke', emoji: '🎤' },
        { value: 'live-music', label: 'Live Music', emoji: '🎸' }
      ]
    },
    {
      title: 'Time Frame',
      key: 'timeFrames',
      options: [
        { value: 'right-now', label: 'Right Now', emoji: '⚡' },
        { value: 'tonight', label: 'Tonight', emoji: '🌙' },
        { value: 'this-weekend', label: 'This Weekend', emoji: '📅' },
        { value: 'tomorrow', label: 'Tomorrow', emoji: '📆' }
      ]
    },
    {
      title: 'Group Size',
      key: 'groupSizes',
      options: [
        { value: 'just-me', label: 'Just Me', emoji: '👤' },
        { value: 'small', label: 'Small Group (2-4)', emoji: '👥' },
        { value: 'medium', label: 'Medium Group (5-8)', emoji: '👥👥' },
        { value: 'large', label: 'Large Group (9+)', emoji: '👥👥👥' }
      ]
    },
    {
      title: 'Location',
      key: 'locationPreferences',
      options: [
        { value: 'nearby', label: 'Nearby', emoji: '📍' },
        { value: 'downtown', label: 'Downtown', emoji: '🏙️' },
        { value: 'specific-areas', label: 'Specific Areas', emoji: '🗺️' }
      ]
    }
  ];

  const getTotalActiveFilters = () => {
    return Object.values(activeFilters).reduce((total, filters) => total + filters.length, 0);
  };

  const isFilterActive = (category: string, value: string) => {
    return activeFilters[category as keyof typeof activeFilters]?.includes(value) || false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 mb-4 bg-background rounded-2xl shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Filter Who's Down?</h2>
            {getTotalActiveFilters() > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {getTotalActiveFilters()} filter{getTotalActiveFilters() !== 1 ? 's' : ''} active
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-muted/50"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
          {filterSections.map((section) => (
            <div key={section.key} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center">
                {section.title}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {section.options.map((option) => {
                  const isActive = isFilterActive(section.key, option.value);
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => onFilterToggle(section.key, option.value)}
                      className={`
                        inline-flex items-center space-x-2 px-3 py-2 rounded-full 
                        text-sm font-medium transition-all duration-200
                        hover:scale-105 active:scale-95
                        ${isActive 
                          ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20' 
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                        }
                      `}
                    >
                      <span>{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20 rounded-b-2xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            disabled={getTotalActiveFilters() === 0}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
          
          <Button
            onClick={onClose}
            className="px-6"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlastsFilterModal;
