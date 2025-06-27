
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { dayColors, WeekdayKey } from '@/utils/dayColors';
import { getFeatureFlag } from '@/utils/featureFlags';

interface WeekdayBadgeProps {
  date: Date | string;
  className?: string;
}

// Helper function to validate if a date is valid
const isValidDate = (date: any): boolean => {
  if (!date) return false;
  const parsedDate = date instanceof Date ? date : new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
};

const WeekdayBadge = ({ date, className }: WeekdayBadgeProps) => {
  if (!getFeatureFlag('plan_weekday_badge_v1')) {
    return null;
  }

  // Validate the date before proceeding
  if (!isValidDate(date)) {
    return null;
  }

  const planDate = typeof date === 'string' ? new Date(date) : date;
  
  // Double-check the converted date is valid
  if (!isValidDate(planDate)) {
    return null;
  }

  const weekday = format(planDate, 'EEE').toUpperCase() as WeekdayKey;
  const badgeColors = dayColors[weekday];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide ring-1 ring-border/30 transition-colors',
        badgeColors.bg,
        badgeColors.text,
        className
      )}
    >
      {weekday}
    </span>
  );
};

export { WeekdayBadge };
