
// Utility for generating stable coordinates from venue names/IDs
export const generateStableCoordinates = (id: string, name: string, baseIndex: number = 0) => {
  // Create a stable hash from the id and name
  const hashString = `${id}-${name}`;
  const hashNumber = hashString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Use hash to generate consistent coordinates around NYC
  const latOffset = ((hashNumber % 400) - 200) * 0.0001; // Wider spread
  const lngOffset = (((hashNumber * 7 + baseIndex) % 400) - 200) * 0.0001;
  
  return {
    lat: 40.7128 + latOffset,
    lng: -74.0060 + lngOffset
  };
};

// Generate coordinates for fallback venues with predetermined positions
export const getFallbackVenueCoordinates = (venueId: string, venueName: string) => {
  const predefinedCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'fb-1': { lat: 40.7589, lng: -73.9851 }, // Times Square area
    'fb-2': { lat: 40.7505, lng: -73.9934 }, // Hell's Kitchen
    'fb-3': { lat: 40.7282, lng: -73.7949 }, // LES
    'fb-4': { lat: 40.7614, lng: -73.9776 }, // Central Park South
    'fb-5': { lat: 40.7074, lng: -74.0113 }  // Financial District
  };
  
  return predefinedCoordinates[venueId] || generateStableCoordinates(venueId, venueName);
};
