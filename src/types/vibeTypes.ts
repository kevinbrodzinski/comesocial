
export interface Vibe {
  id: string;
  icon: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  timeOfDay: 'day' | 'night';
}

export interface UserVibe {
  vibe: Vibe;
  setAt: string;
  expiresAt: string;
  customText?: string;
}

export const VIBE_OPTIONS: Vibe[] = [
  // Day activities
  {
    id: 'coffee-work',
    icon: '☕',
    label: 'Coffee & Work',
    description: 'Getting things done, available for coffee',
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    timeOfDay: 'day'
  },
  {
    id: 'exploring',
    icon: '🗺️',
    label: 'Exploring',
    description: 'Out and about, discovering new places',
    color: 'teal',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-800',
    timeOfDay: 'day'
  },
  {
    id: 'active-outdoors',
    icon: '🏃',
    label: 'Active & Outdoors',
    description: 'Hiking, sports, outdoor activities',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    timeOfDay: 'day'
  },
  {
    id: 'shopping-errands',
    icon: '🛍️',
    label: 'Shopping & Errands',
    description: 'Running errands, retail therapy',
    color: 'pink',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-800',
    timeOfDay: 'day'
  },
  {
    id: 'food-adventures',
    icon: '🍽️',
    label: 'Food Adventures',
    description: 'Trying new restaurants, food focused',
    color: 'emerald',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    timeOfDay: 'day'
  },
  {
    id: 'relaxing-day',
    icon: '🌅',
    label: 'Relaxing Day',
    description: 'Peaceful day, light activities',
    color: 'sky',
    bgColor: 'bg-sky-100',
    textColor: 'text-sky-800',
    timeOfDay: 'day'
  },
  // Night activities
  {
    id: 'going-out',
    icon: '🟣',
    label: 'Going Out',
    description: "I'm out or prepping to go out",
    color: 'violet',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-800',
    timeOfDay: 'night'
  },
  {
    id: 'staying-in',
    icon: '🧘',
    label: 'Staying In',
    description: 'Taking it easy, off the radar',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    timeOfDay: 'night'
  },
  {
    id: 'open-to-plans',
    icon: '✨',
    label: 'Open to Plans',
    description: 'Down to be invited or decide later',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    timeOfDay: 'night'
  },
  {
    id: 'hype-night',
    icon: '🔥',
    label: 'Hype Night',
    description: 'Big energy — parties, events',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    timeOfDay: 'night'
  },
  {
    id: 'chill-mode',
    icon: '🌿',
    label: 'Chill Mode',
    description: 'Casual hangs, not high energy',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    timeOfDay: 'night'
  },
  {
    id: 'just-checking',
    icon: '👀',
    label: 'Just Checking In',
    description: 'Browsing, not committing yet',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    timeOfDay: 'night'
  }
];

export const getVibeById = (id: string): Vibe | undefined => {
  return VIBE_OPTIONS.find(vibe => vibe.id === id);
};

export const getVibesByTimeOfDay = (timeOfDay: 'day' | 'night'): Vibe[] => {
  return VIBE_OPTIONS.filter(vibe => vibe.timeOfDay === timeOfDay);
};

export const isVibeExpired = (userVibe: UserVibe): boolean => {
  return new Date() > new Date(userVibe.expiresAt);
};

export const createVibeExpiry = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(5, 0, 0, 0); // Expires at 5am tomorrow
  return tomorrow.toISOString();
};
