
import React from 'react';
import { Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsBarProps {
  locationPermission: 'denied' | 'granted' | 'pending' | null;
  onRequestLocation: () => void;
  onSetActiveTab: (tab: string) => void;
}

const QuickActionsBar = ({ locationPermission, onRequestLocation, onSetActiveTab }: QuickActionsBarProps) => {
  const handleFindNearby = () => {
    if (locationPermission !== 'granted') {
      onRequestLocation();
    } else {
      onSetActiveTab('nearby');
    }
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 p-4 border-t border-border bg-card/80 backdrop-blur-sm">
      <div className="flex space-x-2">
        <Button className="flex-1 bg-primary hover:bg-primary/80 text-sm h-10 hover:scale-105 transition-all duration-200 shadow-lg">
          <Users size={14} className="mr-2" />
          <span className="truncate">Invite to Plan</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 text-sm h-10 hover:scale-105 transition-all duration-200"
          onClick={handleFindNearby}
        >
          <MapPin size={14} className="mr-2" />
          <span className="truncate">Find Nearby</span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActionsBar;
