
import React from 'react';
import { Users } from 'lucide-react';
import { Venue } from '../../data/venuesData';

interface VenuePinProps {
  venue: Venue;
  isSelected: boolean;
  getVenueColor: (crowdLevel: number) => string;
  onPinClick: (venueId: number) => void;
}

const VenuePin = ({ venue, isSelected, getVenueColor, onPinClick }: VenuePinProps) => {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{ left: `${venue.x}%`, top: `${venue.y}%` }}
      onClick={() => onPinClick(venue.id)}
    >
      {/* Pulsing Ring */}
      <div 
        className={`absolute inset-0 w-8 h-8 rounded-full ${getVenueColor(venue.crowdLevel)} opacity-30 animate-ping`}
      ></div>
      
      {/* Main Pin */}
      <div 
        className={`w-6 h-6 rounded-full ${getVenueColor(venue.crowdLevel)} border-2 border-white shadow-lg relative z-10 pulse-glow transition-all duration-200 ${
          isSelected ? 'scale-125 shadow-xl' : 'hover:scale-110'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Venue Info Card */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-20 pointer-events-none ${
        isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
      }`}>
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[140px]">
          <h3 className="font-semibold text-sm text-foreground">{venue.name}</h3>
          <p className="text-xs text-muted-foreground">{venue.description}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <Users size={12} className="mr-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{venue.crowdLevel}%</span>
            </div>
            <span className="text-xs text-primary">Tap for details</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuePin;
