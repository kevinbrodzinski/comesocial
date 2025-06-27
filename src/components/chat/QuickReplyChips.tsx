
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickReplyChipsProps {
  replies: string[];
  onReplyClick: (reply: string) => void;
  className?: string;
}

const QuickReplyChips = ({ replies, onReplyClick, className = '' }: QuickReplyChipsProps) => {
  if (!replies || replies.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 mt-3 ${className}`}>
      {replies.map((reply, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onReplyClick(reply)}
          className="text-xs px-3 py-1 h-auto bg-secondary/50 hover:bg-secondary border-border hover:border-primary/50 transition-all duration-200"
        >
          {reply}
        </Button>
      ))}
    </div>
  );
};

export default QuickReplyChips;
