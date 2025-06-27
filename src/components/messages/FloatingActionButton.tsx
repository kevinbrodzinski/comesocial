
import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { withFeatureFlag } from '@/utils/featureFlags';

interface FloatingActionButtonProps {
  onNewMessage: () => void;
}

const FloatingActionButton = ({ onNewMessage }: FloatingActionButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onNewMessage}
        size="lg"
        className={`h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 ${withFeatureFlag('contrast-pass-01', 'shadow-md hover:shadow-md')}`}
      >
        <MessageSquarePlus size={24} />
      </Button>
    </div>
  );
};

export default FloatingActionButton;
