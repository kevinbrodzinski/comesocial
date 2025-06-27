
export interface Stop {
  id: number;
  name: string;
  type: string;
  estimatedTime: number;
  cost: number;
  address?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  maxCapacity?: number;
  dresscode?: string;
  bookingStatus?: 'confirmed' | 'pending' | 'none';
  notes?: string;
}

export interface Plan {
  id: number;
  name: string;
  date: string;
  time: string;
  stops: Stop[];
  attendees: number;
  status: 'active' | 'planned' | 'invited' | 'maybe' | 'completed';
  description: string;
  estimatedCost: string;
  duration: string;
  notes: string;
  organizer?: string;
  hostId?: number;
  coPlanners?: number[];
  overviewMessage?: string;
  shareLink?: string;
  rsvpResponses?: {
    going: number;
    maybe: number;
    cantGo: number;
  };
  completedDate?: string;
  attendanceStatus?: 'attended' | 'missed' | 'partial';
  userRating?: number;
  connections?: string[];
  memories?: string[];
  actualCost?: string;
  photos?: {
    id: number;
    url: string;
    caption?: string;
    uploadedAt: string;
  }[];
  reviews?: {
    id: number;
    text: string;
    rating: number;
    date: string;
  }[];
}

export const initialPlans: Plan[] = [
  {
    id: 1,
    name: 'Friday Night Crawl',
    date: 'Tonight',
    time: '9:00 PM',
    stops: [
      { id: 1, name: 'Pre-drinks at Sky Bar', type: 'bar', estimatedTime: 90, cost: 30 },
      { id: 2, name: 'Dancing at Pulse', type: 'club', estimatedTime: 120, cost: 40 },
      { id: 3, name: 'Late night at Underground', type: 'club', estimatedTime: 90, cost: 35 }
    ],
    attendees: 6,
    status: 'active',
    description: 'Epic night out starting with rooftop drinks and ending with underground vibes',
    estimatedCost: '$80-120',
    duration: '5-6 hours',
    notes: 'Dress code: Smart casual. Meeting at Sky Bar entrance at 9 PM sharp!',
    organizer: 'Current User',
    hostId: 1,
    overviewMessage: 'Looking forward to an amazing night out with everyone! Let\'s make it unforgettable.',
    shareLink: 'https://app.nightlife.com/plan/friday-night-crawl-xyz123',
    rsvpResponses: { going: 6, maybe: 2, cantGo: 1 }
  },
  {
    id: 2,
    name: 'Chill Sunday Vibes',
    date: 'This Sunday',
    time: '6:00 PM',
    stops: [
      { id: 4, name: 'Rooftop drinks at Skybar', type: 'bar', estimatedTime: 120, cost: 40 },
      { id: 5, name: 'Jazz at The Green Room', type: 'lounge', estimatedTime: 150, cost: 35 }
    ],
    attendees: 4,
    status: 'planned',
    description: 'Relaxed evening with great views and smooth jazz',
    estimatedCost: '$50-80',
    duration: '3-4 hours',
    notes: 'Perfect for winding down the weekend. Live jazz starts at 8 PM.',
    organizer: 'Current User',
    hostId: 1,
    overviewMessage: 'Perfect way to end the weekend. Bring your chill vibes!',
    shareLink: 'https://app.nightlife.com/plan/sunday-vibes-abc456',
    rsvpResponses: { going: 4, maybe: 3, cantGo: 0 }
  }
];

export const initialFriendsPlans: Plan[] = [
  {
    id: 3,
    name: 'Sarah\'s Bday Bash',
    date: 'Saturday',
    time: '8:00 PM',
    stops: [
      { id: 6, name: 'Dinner at Lux', type: 'restaurant', estimatedTime: 90, cost: 60 },
      { id: 7, name: 'Cocktails at Velvet', type: 'bar', estimatedTime: 90, cost: 45 },
      { id: 8, name: 'Dancing at Neon', type: 'club', estimatedTime: 180, cost: 50 }
    ],
    attendees: 12,
    organizer: 'Sarah M.',
    hostId: 2,
    status: 'invited',
    description: 'Celebrating Sarah\'s 25th birthday in style!',
    estimatedCost: '$100-150',
    duration: '6+ hours',
    notes: 'Birthday girl gets free drinks! Bring your dancing shoes.',
    overviewMessage: 'So excited to celebrate with all my favorite people! This is going to be epic!',
    shareLink: 'https://app.nightlife.com/plan/sarah-bday-def789',
    rsvpResponses: { going: 8, maybe: 4, cantGo: 2 }
  },
  {
    id: 4,
    name: 'Mike\'s Bachelor Party',
    date: 'Next Friday',
    time: '7:00 PM',
    stops: [
      { id: 9, name: 'Sports bar at GameTime', type: 'bar', estimatedTime: 120, cost: 40 },
      { id: 10, name: 'Club at Electric', type: 'club', estimatedTime: 150, cost: 55 },
      { id: 11, name: 'Late night at After Dark', type: 'club', estimatedTime: 120, cost: 45 }
    ],
    attendees: 8,
    organizer: 'Mike K.',
    hostId: 3,
    status: 'maybe',
    description: 'Last hurrah before Mike ties the knot!',
    estimatedCost: '$120-180',
    duration: '7+ hours',
    notes: 'Groom drinks free all night. Pool tournament at GameTime!',
    overviewMessage: 'Boys, this is it! Let\'s send Mike off in style. What happens in Vegas... well, you know.',
    shareLink: 'https://app.nightlife.com/plan/mike-bachelor-ghi012',
    rsvpResponses: { going: 6, maybe: 3, cantGo: 1 }
  }
];

export const initialPastPlans: Plan[] = [
  {
    id: 101,
    name: 'Epic Birthday Celebration',
    date: '2024-05-15',
    time: '8:00 PM',
    stops: [
      { id: 12, name: 'Rooftop Bar', type: 'bar', estimatedTime: 90, cost: 35 },
      { id: 13, name: 'Dance Club', type: 'club', estimatedTime: 180, cost: 50 },
      { id: 14, name: 'Late Night Eats', type: 'restaurant', estimatedTime: 60, cost: 25 }
    ],
    attendees: 8,
    status: 'completed',
    description: 'Amazing night celebrating Jake\'s birthday',
    estimatedCost: '$100-150',
    duration: '6 hours',
    notes: 'Best night ever! Met so many cool people.',
    completedDate: '2024-05-16',
    attendanceStatus: 'attended',
    userRating: 5,
    connections: ['Mike T.', 'Sarah K.', 'Alex M.'],
    memories: ['Great music at the club', 'Amazing rooftop views'],
    actualCost: '$125',
    photos: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
        caption: 'Rooftop views were incredible!',
        uploadedAt: '2024-05-16T02:30:00Z'
      }
    ],
    reviews: [
      {
        id: 1,
        text: 'What an incredible night! The rooftop bar had amazing views and the club was perfect for dancing. Met some really cool people too.',
        rating: 5,
        date: '2024-05-17T10:00:00Z'
      }
    ]
  },
  {
    id: 102,
    name: 'Wine Tasting Night',
    date: '2024-04-20',
    time: '7:00 PM',
    stops: [
      { id: 15, name: 'Wine Bar', type: 'bar', estimatedTime: 120, cost: 45 },
      { id: 16, name: 'Tapas Restaurant', type: 'restaurant', estimatedTime: 120, cost: 50 }
    ],
    attendees: 4,
    status: 'completed',
    description: 'Classy evening exploring local wines',
    estimatedCost: '$80-120',
    duration: '4 hours',
    notes: 'Learned so much about wine pairing!',
    completedDate: '2024-04-20',
    attendanceStatus: 'attended',
    userRating: 4,
    connections: ['Emma L.'],
    memories: ['Discovered amazing Pinot Noir', 'Great conversation'],
    actualCost: '$95'
  }
];
