
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickActionPillProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'host';
}

const QuickActionPill = ({ 
  children, 
  onClick, 
  disabled = false, 
  className,
  variant = 'default'
}: QuickActionPillProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 px-3 rounded-full bg-muted/50 border-muted text-sm font-medium whitespace-nowrap",
        variant === 'host' && "bg-primary/10 border-primary/20",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </Button>
  );
};

export default QuickActionPill;
