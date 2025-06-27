
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Users, User, Calendar } from 'lucide-react';

interface PostContextSelectorProps {
  postContext: 'solo' | 'group' | 'plan';
  onPostContextChange: (context: 'solo' | 'group' | 'plan') => void;
}

const PostContextSelector = ({ postContext, onPostContextChange }: PostContextSelectorProps) => {
  const contexts = [
    { id: 'solo', label: 'Solo', icon: User, description: 'Just you' },
    { id: 'group', label: 'Group', icon: Users, description: 'You + friends' },
    { id: 'plan', label: 'Plan', icon: Calendar, description: 'Linked to plan' }
  ];

  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">Post Context</Label>
      <div className="flex space-x-2">
        {contexts.map((context) => {
          const Icon = context.icon;
          return (
            <Button
              key={context.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPostContextChange(context.id as 'solo' | 'group' | 'plan')}
              className={`flex items-center space-x-1 ${
                postContext === context.id 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border'
              }`}
            >
              <Icon size={14} />
              <span>{context.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default PostContextSelector;
