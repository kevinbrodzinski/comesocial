
export interface VenueReference {
  id: number;
  name: string;
  position: number;
  length: number;
}

export interface ParsedContent {
  text: string;
  venueReferences: VenueReference[];
}

export const parseVenueMentions = (content: string, venueReferences: VenueReference[] = []): string => {
  if (!venueReferences.length) return content;
  
  // Sort by position in reverse order to avoid offset issues when replacing
  const sortedRefs = [...venueReferences].sort((a, b) => b.position - a.position);
  
  let result = content;
  sortedRefs.forEach(ref => {
    const before = result.substring(0, ref.position);
    const after = result.substring(ref.position + ref.length);
    result = before + `@${ref.name}` + after;
  });
  
  return result;
};

export const extractVenueReferences = (content: string): { cleanContent: string; mentions: string[] } => {
  const venuePattern = /@([^@\s]+(?:\s+[^@\s]+)*)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = venuePattern.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  const cleanContent = content.replace(venuePattern, (_, venueName) => venueName);
  
  return { cleanContent, mentions };
};

export const formatMessageWithVenues = (content: string, venueReferences: VenueReference[]): string => {
  if (!venueReferences.length) return content;
  
  let result = content;
  let offset = 0;
  
  venueReferences.forEach(ref => {
    const insertPosition = ref.position + offset;
    const before = result.substring(0, insertPosition);
    const after = result.substring(insertPosition);
    const venueTag = `@${ref.name}`;
    
    result = before + venueTag + after;
    offset += venueTag.length;
  });
  
  return result;
};
