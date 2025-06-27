
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PostTypeSelectorProps {
  postType: 'going-out' | 'rally' | 'looking-for';
  onPostTypeChange: (type: 'going-out' | 'rally' | 'looking-for') => void;
}

const PostTypeSelector = ({ postType, onPostTypeChange }: PostTypeSelectorProps) => {
  const getPostTypeStyle = (type: string) => {
    switch (type) {
      case 'rally':
        return 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100';
      case 'going-out':
        return 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100';
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium">Type</Label>
      <div className="flex space-x-2 mt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPostTypeChange('going-out')}
          className={`${postType === 'going-out' ? getPostTypeStyle('going-out') : ''}`}
        >
          🍻 Going Out
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPostTypeChange('rally')}
          className={`${postType === 'rally' ? getPostTypeStyle('rally') : ''}`}
        >
          🔥 Rally
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPostTypeChange('looking-for')}
          className={`${postType === 'looking-for' ? getPostTypeStyle('looking-for') : ''}`}
        >
          💭 Looking For
        </Button>
      </div>
    </div>
  );
};

export default PostTypeSelector;
