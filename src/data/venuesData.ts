
export interface Venue {
  id: number;
  name: string;
  type: string;
  image: string;
  distance: string;
  crowdLevel: number;
  vibe: string;
  rating: number;
  description: string;
  averageWait: string;
  bestTimes: string[];
  features: string[];
  lastVisited: string;
  address?: string;
  phone?: string;
  hours?: string;
  priceLevel?: string;
  x?: number; // For map positioning
  y?: number; // For map positioning
}

export const venues: Venue[] = [
  {
    id: 1,
    name: 'The Rooftop',
    type: 'Rooftop Bar',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=200&fit=crop',
    distance: '0.8 mi',
    crowdLevel: 75,
    vibe: 'Trendy',
    rating: 4.5,
    description: 'Rooftop bar with stunning city views and craft cocktails',
    averageWait: '15-20 min',
    bestTimes: ['Thu 8-10pm', 'Fri 9-11pm', 'Sat 7-9pm'],
    features: ['Craft Cocktails', 'City Views', 'Live DJ'],
    lastVisited: '2 days ago',
    address: '123 Main St, Downtown',
    phone: '(555) 123-4567',
    hours: 'Open until 2:00 AM',
    priceLevel: '$$$',
    x: 30,
    y: 40
  },
  {
    id: 2,
    name: 'Underground',
    type: 'Speakeasy',
    image: 'https://images.unsplash.com/photo-1571266028243-d220c9c3fad2?w=400&h=200&fit=crop',
    distance: '1.2 mi',
    crowdLevel: 45,
    vibe: 'Intimate',
    rating: 4.3,
    description: 'Hidden speakeasy with craft cocktails and jazz ambiance',
    averageWait: '5-10 min',
    bestTimes: ['Wed 7-9pm', 'Thu 8-10pm', 'Sun 6-8pm'],
    features: ['Craft Cocktails', 'Jazz Music', 'Hidden Entrance'],
    lastVisited: '1 week ago',
    address: '456 Oak Ave, Arts District',
    phone: '(555) 234-5678',
    hours: 'Open until 1:00 AM',
    priceLevel: '$$$$',
    x: 75,
    y: 60
  },
  {
    id: 3,
    name: 'Pulse Nightclub',
    type: 'Nightclub',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=200&fit=crop',
    distance: '0.5 mi',
    crowdLevel: 90,
    vibe: 'High Energy',
    rating: 4.7,
    description: 'High-energy nightclub with top DJs and massive dance floor',
    averageWait: '30-45 min',
    bestTimes: ['Fri 10pm-12am', 'Sat 11pm-1am'],
    features: ['Electronic Music', 'Large Dance Floor', 'VIP Area'],
    lastVisited: '3 days ago',
    address: '789 Club St, Entertainment District',
    phone: '(555) 345-6789',
    hours: 'Open until 3:00 AM',
    priceLevel: '$$$',
    x: 30,
    y: 40
  },
  {
    id: 4,
    name: 'Sky Bar',
    type: 'Cocktail Lounge',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=200&fit=crop',
    distance: '1.5 mi',
    crowdLevel: 60,
    vibe: 'Sophisticated',
    rating: 4.1,
    description: 'Upscale cocktail lounge with premium spirits and skyline views',
    averageWait: '10-15 min',
    bestTimes: ['Tue 6-8pm', 'Wed 7-9pm', 'Thu 8-10pm'],
    features: ['Premium Spirits', 'Skyline Views', 'Date Night'],
    lastVisited: '5 days ago',
    address: '321 High St, Financial District',
    phone: '(555) 456-7890',
    hours: 'Open until 2:00 AM',
    priceLevel: '$$$$',
    x: 60,
    y: 25
  },
  {
    id: 5,
    name: 'Neon Lounge',
    type: 'Cocktail Bar',
    image: 'https://images.unsplash.com/photo-1546171753-97d7676cd5d8?w=400&h=200&fit=crop',
    distance: '0.3 mi',
    crowdLevel: 65,
    vibe: 'Trendy',
    rating: 4.5,
    description: 'Modern cocktail bar with neon aesthetics and live music',
    averageWait: '10-15 min',
    bestTimes: ['Thu 8-10pm', 'Fri 9-11pm', 'Sat 8-10pm'],
    features: ['Live Music', 'Craft Cocktails', 'Late Night'],
    lastVisited: '1 week ago',
    address: '654 Neon Ave, Trendy District',
    phone: '(555) 567-8901',
    hours: 'Open until 2:00 AM',
    priceLevel: '$$$',
    x: 80,
    y: 35
  },
  {
    id: 6,
    name: 'Garden Terrace',
    type: 'Wine Bar',
    image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=200&fit=crop',
    distance: '0.7 mi',
    crowdLevel: 40,
    vibe: 'Relaxed',
    rating: 4.3,
    description: 'Charming wine bar with outdoor garden seating',
    averageWait: '5-10 min',
    bestTimes: ['Wed 6-8pm', 'Thu 7-9pm', 'Sun 5-7pm'],
    features: ['Outdoor Seating', 'Wine Selection', 'Happy Hour'],
    lastVisited: '2 weeks ago',
    address: '987 Garden Rd, Suburb',
    phone: '(555) 678-9012',
    hours: 'Open until 11:00 PM',
    priceLevel: '$$',
    x: 20,
    y: 70
  },
  {
    id: 7,
    name: 'Electric Club',
    type: 'Nightclub',
    image: 'https://images.unsplash.com/photo-1571266028243-d220c9c3fad2?w=400&h=200&fit=crop',
    distance: '1.1 mi',
    crowdLevel: 85,
    vibe: 'High Energy',
    rating: 4.7,
    description: 'Electric atmosphere with cutting-edge sound and lighting',
    averageWait: '25-30 min',
    bestTimes: ['Fri 10pm-1am', 'Sat 11pm-2am'],
    features: ['DJ Sets', 'Dance Floor', 'VIP Bottles'],
    lastVisited: 'Last weekend',
    address: '159 Electric Ave, Club District',
    phone: '(555) 789-0123',
    hours: 'Open until 3:00 AM',
    priceLevel: '$$$',
    x: 80,
    y: 35
  }
];

export const getVenueById = (id: number): Venue | undefined => {
  return venues.find(venue => venue.id === id);
};

export const getVenuesByType = (type: string): Venue[] => {
  return venues.filter(venue => venue.type.toLowerCase().includes(type.toLowerCase()));
};

export const getVenuesByVibe = (vibe: string): Venue[] => {
  return venues.filter(venue => venue.vibe.toLowerCase().includes(vibe.toLowerCase()));
};

export const getVenuesByCrowdLevel = (minLevel: number, maxLevel: number): Venue[] => {
  return venues.filter(venue => venue.crowdLevel >= minLevel && venue.crowdLevel <= maxLevel);
};
