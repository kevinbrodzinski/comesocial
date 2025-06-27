
import React from 'react';
import { BookmarkCheck } from 'lucide-react';

interface SaveTooltipProps {
  isVisible: boolean;
  onComplete: () => void;
}

const SaveTooltip = ({ isVisible, onComplete }: SaveTooltipProps) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-lg px-3 py-2 shadow-lg animate-fade-in z-10">
      <div className="flex items-center space-x-2 text-sm">
        <BookmarkCheck size={14} className="text-primary animate-scale-in" />
        <span>Saved to Favorites</span>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
      </div>
    </div>
  );
};

export default SaveTooltip;
