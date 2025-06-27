
import React from 'react';
import { Users, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsMenuProps {
  onInviteToPlan: () => void;
  onMessages: () => void;
  onLocationSharing: () => void;
}

const QuickActionsMenu = ({ onInviteToPlan, onMessages, onLocationSharing }: QuickActionsMenuProps) => {
  return (
    <div className="fixed bottom-20 left-0 right-0 p-2 sm:p-4 border-t border-border bg-card/80 backdrop-blur-sm safe-area-pb">
      <div className="flex space-x-1 sm:space-x-2 max-w-md mx-auto">
        <Button 
          className="flex-1 bg-primary hover:bg-primary/80 text-xs sm:text-sm h-12 sm:h-10 hover:scale-105 transition-all duration-200 shadow-lg min-w-0 px-2 sm:px-4"
          onClick={onInviteToPlan}
        >
          <Users size={16} className="shrink-0" />
          <span className="hidden xs:inline ml-1 sm:ml-2 truncate">Invite to Plan</span>
          <span className="xs:hidden ml-1 truncate">Invite</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 text-xs sm:text-sm h-12 sm:h-10 hover:scale-105 transition-all duration-200 min-w-0 px-2 sm:px-4"
          onClick={onMessages}
        >
          <MessageCircle size={16} className="shrink-0" />
          <span className="hidden xs:inline ml-1 sm:ml-2 truncate">Messages</span>
          <span className="xs:hidden ml-1 truncate">Messages</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 text-xs sm:text-sm h-12 sm:h-10 hover:scale-105 transition-all duration-200 min-w-0 px-2 sm:px-4"
          onClick={onLocationSharing}
        >
          <MapPin size={16} className="shrink-0" />
          <span className="hidden xs:inline ml-1 sm:ml-2 truncate">Location</span>
          <span className="xs:hidden ml-1 truncate">Location</span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActionsMenu;
