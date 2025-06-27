
import React, { useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
  currentLocation?: string;
}

const MapPickerModal = ({ isOpen, onClose, onLocationSelect, currentLocation }: MapPickerModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(currentLocation || '');

  const suggestedLocations = [
    'Sky Bar - Main Entrance',
    'Pulse Club - Front Door',
    'The Green Room - Side Entrance',
    'Velvet Lounge - Valet Stand',
    'Central Park - North Entrance',
    'Union Station - Main Hall'
  ];

  const filteredLocations = suggestedLocations.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (location: string) => {
    setSelectedLocation(location);
    onLocationSelect(location);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Meetup Location</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a meetup spot..."
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredLocations.map((location, index) => (
              <div
                key={index}
                className="flex items-center p-3 hover:bg-muted cursor-pointer rounded-lg transition-colors"
                onClick={() => handleSelect(location)}
              >
                <MapPin size={16} className="mr-3 text-muted-foreground" />
                <span className="flex-1">{location}</span>
              </div>
            ))}
            
            {searchQuery && (
              <div
                className="flex items-center p-3 hover:bg-muted cursor-pointer rounded-lg transition-colors border-2 border-dashed border-muted-foreground/30"
                onClick={() => handleSelect(searchQuery)}
              >
                <MapPin size={16} className="mr-3 text-muted-foreground" />
                <span className="flex-1">Use "{searchQuery}"</span>
              </div>
            )}
          </div>

          {selectedLocation && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-2">Current meetup location:</p>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-primary" />
                  <span className="text-sm">{selectedLocation}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedLocation('');
                    onLocationSelect('');
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapPickerModal;
