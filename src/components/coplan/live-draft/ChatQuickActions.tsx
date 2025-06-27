
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Lock, Clock, MapPin, Vote, Share } from 'lucide-react';

interface ChatQuickActionsProps {
  isLocked: boolean;
  hasStops: boolean;
  onAddStop: () => void;
  onToggleLock: () => void;
  onSuggestTime: () => void;
  onShareLocation: () => void;
  onCreateVote: () => void;
  onShare: () => void;
  isLoading?: boolean;
}

const ChatQuickActions = ({ 
  isLocked, 
  hasStops, 
  onAddStop, 
  onToggleLock, 
  onSuggestTime, 
  onShareLocation, 
  onCreateVote,
  onShare,
  isLoading = false 
}: ChatQuickActionsProps) => {
  const lockVariant = isLocked ? "default" : "outline";
  
  const actions = [
    {
      icon: Plus,
      label: "Add Stop",
      action: onAddStop,
      disabled: isLocked,
      variant: "outline" as const
    },
    {
      icon: isLocked ? Lock : Lock,
      label: isLocked ? "Unlock" : "Lock Plan",
      action: onToggleLock,
      disabled: !hasStops,
      variant: lockVariant as "default" | "outline"
    },
    {
      icon: Clock,
      label: "Set Time",
      action: onSuggestTime,
      disabled: isLocked,
      variant: "outline" as const
    },
    {
      icon: MapPin,
      label: "Location",
      action: onShareLocation,
      disabled: false,
      variant: "outline" as const
    },
    {
      icon: Vote,
      label: "Vote",
      action: onCreateVote,
      disabled: isLocked || !hasStops,
      variant: "outline" as const
    },
    {
      icon: Share,
      label: "Share",
      action: onShare,
      disabled: false,
      variant: "outline" as const
    }
  ];

  return (
    <div className="border-b p-3">
      <div className="grid grid-cols-3 gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            size="sm"
            onClick={action.action}
            disabled={action.disabled || isLoading}
            className="flex flex-col items-center space-y-1 h-auto py-2 text-xs"
          >
            <action.icon size={16} />
            <span className="hidden sm:inline">{action.label}</span>
            <span className="sm:hidden">{action.label.split(' ')[0]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ChatQuickActions;
