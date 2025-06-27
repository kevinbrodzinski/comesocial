import { Plan } from '@/data/plansData';

export interface PlanInvitation {
  id: string;
  planId: number;
  planName: string;
  organizer: string;
  organizerAvatar?: string;
  invitedAt: Date;
  expiresAt?: Date;
  status: 'pending' | 'accepted' | 'declined' | 'maybe';
  urgency: 'low' | 'medium' | 'high';
  plan: Plan;
  mutualFriends?: string[];
  message?: string;
  type?: 'regular' | 'co-plan'; // New field for co-plan invitations
}

interface InvitationState {
  invitations: PlanInvitation[];
  unreadCount: number;
}

class InvitationService {
  private static instance: InvitationService;
  private state: InvitationState = {
    invitations: [],
    unreadCount: 0
  };
  private listeners: Set<(state: InvitationState) => void> = new Set();

  static getInstance(): InvitationService {
    if (!InvitationService.instance) {
      InvitationService.instance = new InvitationService();
    }
    return InvitationService.instance;
  }

  constructor() {
    // Initialize with some mock invitations for demo
    this.state.invitations = [
      {
        id: 'inv-1',
        planId: 3,
        planName: "Sarah's Bday Bash",
        organizer: 'Sarah M.',
        organizerAvatar: 'SM',
        invitedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        status: 'pending',
        urgency: 'high',
        type: 'regular',
        plan: {
          id: 3,
          name: "Sarah's Bday Bash",
          date: 'Saturday',
          time: '8:00 PM',
          stops: [
            { id: 6, name: 'Dinner at Lux', type: 'restaurant', estimatedTime: 90, cost: 60 },
            { id: 7, name: 'Cocktails at Velvet', type: 'bar', estimatedTime: 90, cost: 45 }
          ],
          attendees: 12,
          status: 'invited',
          description: "Celebrating Sarah's 25th birthday in style!",
          estimatedCost: '$100-150',
          duration: '6+ hours',
          notes: 'Birthday girl gets free drinks!'
        },
        mutualFriends: ['Alex', 'Mike', 'Emma'],
        message: "You're invited to celebrate my birthday! It's going to be amazing 🎉"
      },
      {
        id: 'inv-2',
        planId: 4,
        planName: "Mike's Bachelor Party",
        organizer: 'Mike K.',
        organizerAvatar: 'MK',
        invitedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'pending',
        urgency: 'medium',
        type: 'regular',
        plan: {
          id: 4,
          name: "Mike's Bachelor Party",
          date: 'Next Friday',
          time: '7:00 PM',
          stops: [
            { id: 9, name: 'Sports bar at GameTime', type: 'bar', estimatedTime: 120, cost: 40 }
          ],
          attendees: 8,
          status: 'invited',
          description: "Last hurrah before Mike ties the knot!",
          estimatedCost: '$120-180',
          duration: '7+ hours',
          notes: 'Groom drinks free all night.'
        },
        mutualFriends: ['Jake', 'Chris'],
        message: "Join us for my bachelor party - it's going to be legendary!"
      },
      // Add mock co-plan invitation
      {
        id: 'inv-coplan-1',
        planId: 5,
        planName: "Weekend Getaway Planning",
        organizer: 'Alex M.',
        organizerAvatar: 'AM',
        invitedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        status: 'pending',
        urgency: 'medium',
        type: 'co-plan',
        plan: {
          id: 5,
          name: "Weekend Getaway Planning",
          date: 'This Weekend',
          time: '10:00 AM',
          stops: [],
          attendees: 4,
          status: 'invited',
          description: "Let's plan an epic weekend getaway together! We need to figure out where to go and what to do.",
          estimatedCost: 'TBD',
          duration: 'All weekend',
          notes: 'Everyone can edit and add ideas!'
        },
        mutualFriends: ['Sarah', 'Emma'],
        message: "Want to help plan our weekend trip? We can all work on it together!"
      }
    ];
    this.state.unreadCount = this.state.invitations.filter(inv => inv.status === 'pending').length;
  }

  subscribe(listener: (state: InvitationState) => void) {
    this.listeners.add(listener);
    // Return current state immediately
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  addInvitation(invitation: Omit<PlanInvitation, 'id' | 'invitedAt'>) {
    const newInvitation: PlanInvitation = {
      ...invitation,
      id: `inv-${Date.now()}`,
      invitedAt: new Date(),
      status: 'pending'
    };
    
    this.state.invitations.unshift(newInvitation);
    this.state.unreadCount++;
    this.notify();
    
    return newInvitation;
  }

  respondToInvitation(invitationId: string, response: 'accepted' | 'declined' | 'maybe') {
    const invitation = this.state.invitations.find(inv => inv.id === invitationId);
    if (invitation && invitation.status === 'pending') {
      invitation.status = response;
      this.state.unreadCount = Math.max(0, this.state.unreadCount - 1);
      this.notify();
    }
    return invitation;
  }

  markAsRead() {
    this.state.unreadCount = 0;
    this.notify();
  }

  getPendingInvitations(): PlanInvitation[] {
    return this.state.invitations.filter(inv => inv.status === 'pending');
  }

  getInvitations(): PlanInvitation[] {
    return this.state.invitations;
  }

  getUnreadCount(): number {
    return this.state.unreadCount;
  }

  getState(): InvitationState {
    return { ...this.state };
  }

  // Simulate receiving new invitations for demo
  simulateNewInvitation() {
    const mockInvitation = {
      planId: Math.floor(Math.random() * 1000),
      planName: "Weekend Hangout",
      organizer: 'Alex',
      organizerAvatar: 'AM',
      status: 'pending' as const,
      urgency: 'medium' as const,
      type: 'regular' as const,
      plan: {
        id: Math.floor(Math.random() * 1000),
        name: "Weekend Hangout",
        date: 'This Saturday',
        time: '7:00 PM',
        stops: [
          { id: 1, name: 'Happy Hour at Bar 21', type: 'bar', estimatedTime: 90, cost: 30 }
        ],
        attendees: 4,
        status: 'invited' as const,
        description: "Let's hang out this weekend!",
        estimatedCost: '$40-60',
        duration: '3-4 hours',
        notes: 'Casual hangout with drinks'
      },
      mutualFriends: ['Sarah', 'Emma'],
      message: "Want to join us for some drinks this weekend?"
    };
    
    this.addInvitation(mockInvitation);
  }
}

export default InvitationService;
