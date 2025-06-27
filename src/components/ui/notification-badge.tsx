
import React from 'react';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  show: boolean;
  className?: string;
  children: React.ReactNode;
}

export const NotificationBadge = ({ count, show, className, children }: NotificationBadgeProps) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {show && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center min-w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-background animate-pulse">
          {count > 9 ? '9+' : count}
        </div>
      )}
    </div>
  );
};
