
import React from 'react';
import QuickReplyChips from './QuickReplyChips';

interface FollowUpMessageProps {
  message: string;
  quickReplies?: string[];
  onReplyClick: (reply: string) => void;
}

const FollowUpMessage = ({ message, quickReplies, onReplyClick }: FollowUpMessageProps) => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] bg-card border border-border p-4 rounded-2xl rounded-bl-md">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            N
          </div>
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-foreground mb-2">
              {message}
            </p>
            {quickReplies && (
              <QuickReplyChips 
                replies={quickReplies} 
                onReplyClick={onReplyClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpMessage;
