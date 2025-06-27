
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Vibe, UserVibe, isVibeExpired } from '@/types/vibeTypes';

interface VibeBadgeProps {
  userVibe?: UserVibe | null;
  size?: 'sm' | 'md';
  showCustomText?: boolean;
}

const VibeBadge = ({ userVibe, size = 'sm', showCustomText = false }: VibeBadgeProps) => {
  if (!userVibe || isVibeExpired(userVibe)) {
    return null;
  }

  const { vibe, customText } = userVibe;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <Badge 
      className={`
        ${vibe.bgColor} ${vibe.textColor} border-0 font-medium ${sizeClasses}
        flex items-center gap-1 max-w-fit
      `}
    >
      <span>{vibe.icon}</span>
      <span>{vibe.label}</span>
      {showCustomText && customText && (
        <span className="text-xs opacity-75">• {customText}</span>
      )}
    </Badge>
  );
};

export default VibeBadge;
