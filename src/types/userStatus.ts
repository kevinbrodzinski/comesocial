
export type UserStatusType = 
  | 'on-my-way' 
  | 'im-here' 
  | 'running-late' 
  | 'next-spot' 
  | 'calling-it';

export interface UserStatus {
  status: UserStatusType;
  timestamp: string;
  venueId?: number;
  eta?: string;
  note?: string;
  delayReason?: string;
  estimatedArrival?: string;
}

export interface StatusOption {
  type: UserStatusType;
  label: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  actions: StatusAction[];
}

export interface StatusAction {
  type: 'primary' | 'secondary' | 'auto';
  label: string;
  action: string;
  condition?: (context: any) => boolean;
}

export const statusOptions: StatusOption[] = [
  {
    type: 'on-my-way',
    label: 'On My Way',
    icon: '🚶',
    description: 'Heading to the venue now',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    actions: [
      { type: 'auto', label: 'Enable Location Sharing', action: 'enableLocationSharing' },
      { type: 'secondary', label: 'Share ETA', action: 'shareETA' },
      { type: 'secondary', label: 'Ping Friends', action: 'pingLocation' }
    ]
  },
  {
    type: 'im-here',
    label: "I'm Here",
    icon: '📍',
    description: 'Arrived and ready to party',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400',
    actions: [
      { type: 'auto', label: 'Check In', action: 'checkIn' },
      { type: 'primary', label: 'Next Spot', action: 'showNextStop', condition: (ctx) => ctx.hasNextStop },
      { type: 'secondary', label: 'Rate Venue', action: 'rateVenue' },
      { type: 'secondary', label: 'Share Check-in', action: 'shareCheckIn' }
    ]
  },
  {
    type: 'running-late',
    label: 'Running Late',
    icon: '⏰',
    description: 'Delayed but still coming',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-400',
    actions: [
      { type: 'primary', label: 'Set New ETA', action: 'setETA' },
      { type: 'auto', label: 'Notify Friends', action: 'notifyDelay' },
      { type: 'secondary', label: 'Quick Message', action: 'sendDelayMessage' }
    ]
  },
  {
    type: 'next-spot',
    label: 'Next Spot',
    icon: '➡️',
    description: 'Ready to move to the next venue',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-400',
    actions: [
      { type: 'auto', label: 'Move to Next', action: 'moveToNext' },
      { type: 'secondary', label: 'Get Directions', action: 'navigate' },
      { type: 'secondary', label: 'Invite Others', action: 'inviteToNext' }
    ]
  },
  {
    type: 'calling-it',
    label: 'Calling It',
    icon: '🌙',
    description: 'Heading home for the night',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-400',
    actions: [
      { type: 'auto', label: 'End Night', action: 'endNight' },
      { type: 'secondary', label: 'Share Highlights', action: 'shareHighlights' },
      { type: 'secondary', label: 'Safe Home Notification', action: 'safeHome' }
    ]
  }
];

export const getStatusOption = (type: UserStatusType): StatusOption => {
  return statusOptions.find(option => option.type === type) || statusOptions[0];
};
