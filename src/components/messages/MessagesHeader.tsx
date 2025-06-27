
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MessagesHeaderProps {
  onBack: () => void;
  unreadCount: number;
}

const MessagesHeader = ({ onBack, unreadCount }: MessagesHeaderProps) => {
  const handleBackClick = () => {
    console.log('MessagesHeader: Back button clicked');
    onBack();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-card border-b border-border h-16">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={handleBackClick} className="h-8 w-8 p-0">
            <ArrowLeft size={16} />
          </Button>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">Messages</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesHeader;
