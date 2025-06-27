
import React from 'react';
import VenueTag from './VenueTag';

interface VenueReference {
  id: number;
  name: string;
  position: number;
  length: number;
}

interface MessageWithVenuesProps {
  content: string;
  venueReferences?: VenueReference[];
  onVenueClick?: (venueId: number, venueName: string) => void;
  className?: string;
}

const MessageWithVenues = ({ 
  content, 
  venueReferences = [], 
  onVenueClick,
  className = ""
}: MessageWithVenuesProps) => {
  if (!venueReferences.length) {
    return <span className={className}>{content}</span>;
  }

  // Sort venue references by position
  const sortedRefs = [...venueReferences].sort((a, b) => a.position - b.position);
  
  const elements: (string | React.ReactElement)[] = [];
  let lastIndex = 0;

  sortedRefs.forEach((ref, index) => {
    // Add text before this venue reference
    if (ref.position > lastIndex) {
      const textBefore = content.substring(lastIndex, ref.position);
      if (textBefore) {
        elements.push(textBefore);
      }
    }

    // Add the venue tag
    elements.push(
      <VenueTag
        key={`venue-${ref.id}-${index}`}
        venueName={ref.name}
        venueId={ref.id}
        onClick={() => onVenueClick?.(ref.id, ref.name)}
        className="mx-1"
      />
    );

    lastIndex = ref.position + ref.length;
  });

  // Add remaining text after the last venue reference
  if (lastIndex < content.length) {
    const textAfter = content.substring(lastIndex);
    if (textAfter) {
      elements.push(textAfter);
    }
  }

  return (
    <span className={className}>
      {elements.map((element, index) => 
        typeof element === 'string' ? element : React.cloneElement(element, { key: index })
      )}
    </span>
  );
};

export default MessageWithVenues;
