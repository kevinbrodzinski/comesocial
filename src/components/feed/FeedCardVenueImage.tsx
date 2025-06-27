
import React from 'react';
import { Users } from 'lucide-react';

interface FeedCardVenueImageProps {
  image: string;
  venue: string;
  crowdLevel: number;
}

const FeedCardVenueImage = ({ image, venue, crowdLevel }: FeedCardVenueImageProps) => {
  return (
    <div className="relative">
      <img 
        src={image} 
        alt={venue}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      
      <div className="absolute bottom-3 right-3">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-2">
          <Users size={12} className="text-white" />
          <span className="text-white text-sm font-medium">{crowdLevel}%</span>
        </div>
      </div>
    </div>
  );
};

export default FeedCardVenueImage;
