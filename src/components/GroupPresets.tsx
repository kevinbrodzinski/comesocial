
import React from 'react';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GroupPreset {
  id: string;
  name: string;
  members: Array<{ id: number; name: string; avatar: string }>;
}

interface GroupPresetsProps {
  onSelectGroup: (group: GroupPreset) => void;
}

const GroupPresets = ({ onSelectGroup }: GroupPresetsProps) => {
  const groupPresets: GroupPreset[] = [
    {
      id: 'weekend-crew',
      name: 'Weekend Crew',
      members: [
        { id: 1, name: 'Sarah M.', avatar: '🙋‍♀️' },
        { id: 3, name: 'Emma L.', avatar: '👩‍🎨' },
        { id: 4, name: 'Alex R.', avatar: '🧑‍💻' },
        { id: 5, name: 'Chris P.', avatar: '👨‍🍳' }
      ]
    },
    {
      id: 'work-squad',
      name: 'Work Squad', 
      members: [
        { id: 2, name: 'Mike K.', avatar: '👨‍💼' },
        { id: 4, name: 'Alex R.', avatar: '🧑‍💻' }
      ]
    }
  ];

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Quick invite groups:</p>
      {groupPresets.map((group) => (
        <div
          key={group.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => onSelectGroup(group)}
        >
          <div className="flex items-center">
            <Users size={16} className="mr-2 text-muted-foreground" />
            <div>
              <span className="font-medium">{group.name}</span>
              <div className="flex items-center mt-1">
                {group.members.slice(0, 3).map((member, idx) => (
                  <span key={member.id} className="text-xs mr-1">
                    {member.avatar}
                  </span>
                ))}
                <Badge variant="outline" className="text-xs">
                  {group.members.length} friends
                </Badge>
              </div>
            </div>
          </div>
          <Plus size={16} className="text-muted-foreground" />
        </div>
      ))}
    </div>
  );
};

export default GroupPresets;
