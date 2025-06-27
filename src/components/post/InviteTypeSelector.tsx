
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface InviteTypeSelectorProps {
  inviteType: 'open' | 'friends-only' | 'group';
  onInviteTypeChange: (type: 'open' | 'friends-only' | 'group') => void;
}

const InviteTypeSelector = ({ inviteType, onInviteTypeChange }: InviteTypeSelectorProps) => {
  return (
    <div>
      <Label>Who can see this?</Label>
      <div className="flex space-x-2 mt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onInviteTypeChange('friends-only')}
          className={`${inviteType === 'friends-only' ? 'bg-primary/10 border-primary text-primary' : ''}`}
        >
          <Users size={14} className="mr-1" />
          Friends Only
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onInviteTypeChange('open')}
          className={`${inviteType === 'open' ? 'bg-primary/10 border-primary text-primary' : ''}`}
        >
          Open
        </Button>
      </div>
    </div>
  );
};

export default InviteTypeSelector;
