
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SectionCard = ({ title, children, className }: SectionCardProps) => {
  return (
    <div className={cn(
      "rounded-xl border border-border bg-card/40 p-4 space-y-3 shadow-sm",
      className
    )}>
      <h3 className="text-sm font-semibold text-foreground/80">{title}</h3>
      {children}
    </div>
  );
};

export { SectionCard };
