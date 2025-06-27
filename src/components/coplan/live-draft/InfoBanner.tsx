
import React from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfoBannerProps {
  message: string;
  onDismiss: () => void;
}

const InfoBanner = ({ message, onDismiss }: InfoBannerProps) => {
  return (
    <div className="bg-muted/30 border-b border-border px-4 py-3">
      <div className="flex items-start space-x-3">
        <MessageCircle size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            {message}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-6 w-6 -mt-1 -mr-1 flex-shrink-0"
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
};

export default InfoBanner;
