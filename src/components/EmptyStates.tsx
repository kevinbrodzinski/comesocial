
import React from 'react';
import { Users, UserPlus, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStatesProps {
  activeTab: string;
  locationPermission: 'denied' | 'granted' | 'pending' | null;
  onAddFriend: () => void;
  onRequestLocation: () => void;
}

const EmptyStates = ({ activeTab, locationPermission, onAddFriend, onRequestLocation }: EmptyStatesProps) => {
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 'active':
        return {
          message: 'None of your friends are out right now',
          showAddButton: false
        };
      case 'nearby':
        return {
          message: locationPermission === 'denied' 
            ? 'Enable location to see nearby friends' 
            : 'No friends are nearby',
          showAddButton: false,
          showLocationButton: locationPermission === 'denied'
        };
      case 'on-plan':
        return {
          message: 'No friends are on a plan',
          showAddButton: false
        };
      case 'all':
        return {
          message: 'Add some friends to get started',
          showAddButton: true
        };
      default:
        return {
          message: `No friends ${activeTab}`,
          showAddButton: false
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="text-center py-8 text-muted-foreground animate-fade-in">
      <Users size={48} className="mx-auto mb-4 opacity-50" />
      <p className="text-lg font-medium">No friends {activeTab === 'all' ? '' : activeTab}</p>
      <p className="text-sm mt-1 px-4 mb-4">
        {content.message}
      </p>
      {content.showAddButton && (
        <Button onClick={onAddFriend} className="mt-2 hover:scale-105 transition-transform">
          <UserPlus size={16} className="mr-2" />
          Add Your First Friend
        </Button>
      )}
      {content.showLocationButton && (
        <Button onClick={onRequestLocation} className="mt-2 hover:scale-105 transition-transform">
          <Navigation size={16} className="mr-2" />
          Enable Location
        </Button>
      )}
    </div>
  );
};

export default EmptyStates;
