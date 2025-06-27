
import React from 'react';
import { Eye, Plus, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResult {
  id: string;
  type: 'venue' | 'tag' | 'area' | 'plan' | 'place' | 'fallback';
  name: string;
  subtitle?: string;
  icon: React.ReactNode;
  placeData?: any;
  fallbackData?: any;
}

interface SearchResultActionsProps {
  result: SearchResult;
  onQuickAction: (result: SearchResult, action: 'view' | 'add' | 'start', e: React.MouseEvent) => void;
  planningMode?: boolean;
}

const SearchResultActions = ({ result, onQuickAction, planningMode = false }: SearchResultActionsProps) => {
  if (planningMode) {
    // In planning mode, show simplified actions focused on adding to plan
    return (
      <div className="flex space-x-2 mt-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-7 text-xs"
          onClick={(e) => onQuickAction(result, 'view', e)}
        >
          <Eye size={12} className="mr-1" />
          Preview
        </Button>
        <Button
          size="sm"
          className="flex-1 h-7 text-xs bg-primary"
          onClick={(e) => onQuickAction(result, 'add', e)}
        >
          <Plus size={12} className="mr-1" />
          Add to Plan
        </Button>
      </div>
    );
  }

  // Normal mode - show all actions
  return (
    <div className="flex space-x-2 mt-2">
      <Button
        size="sm"
        variant="outline"
        className="flex-1 h-7 text-xs"
        onClick={(e) => onQuickAction(result, 'view', e)}
      >
        <Eye size={12} className="mr-1" />
        View
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="flex-1 h-7 text-xs"
        onClick={(e) => onQuickAction(result, 'add', e)}
      >
        <Plus size={12} className="mr-1" />
        Add to Plan
      </Button>
      <Button
        size="sm"
        className="flex-1 h-7 text-xs bg-primary"
        onClick={(e) => onQuickAction(result, 'start', e)}
      >
        <Play size={12} className="mr-1" />
        Start Plan
      </Button>
    </div>
  );
};

export default SearchResultActions;
