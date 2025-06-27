import PlanStateService from './PlanStateService';
import NotificationService from './NotificationService';
import { UserStatusType, StatusAction } from '@/types/userStatus';

export class StatusActionService {
  private static instance: StatusActionService;
  private planService: PlanStateService;
  private notificationService: NotificationService;

  constructor() {
    this.planService = PlanStateService.getInstance();
    this.notificationService = NotificationService.getInstance();
  }

  static getInstance(): StatusActionService {
    if (!StatusActionService.instance) {
      StatusActionService.instance = new StatusActionService();
    }
    return StatusActionService.instance;
  }

  async executeStatusActions(status: UserStatusType, context: any = {}) {
    console.log(`🎯 Executing actions for status: ${status}`, context);

    switch (status) {
      case 'on-my-way':
        return this.handleOnMyWayActions(context);
      case 'im-here':
        return this.handleImHereActions(context);
      case 'running-late':
        return this.handleRunningLateActions(context);
      case 'next-spot':
        return this.handleNextSpotActions(context);
      case 'calling-it':
        return this.handleCallingItActions(context);
    }
  }

  private async handleOnMyWayActions(context: any) {
    // Auto-enable location sharing
    this.enableLocationSharing();
    
    // Update plan state to en_route if not already
    const currentState = this.planService.getPlanProgressState();
    if (currentState === 'not_started') {
      this.planService.startNight();
    }

    // Broadcast location update
    this.broadcastLocationUpdate('en_route');

    // Show ETA options
    return {
      showETAInput: true,
      enableLocationSharing: true,
      actions: ['shareETA', 'pingLocation']
    };
  }

  private async handleImHereActions(context: any) {
    // Auto check-in
    if (context.onCheckIn) {
      context.onCheckIn();
    }
    
    // Update plan state
    this.planService.checkInToVenue();

    // Broadcast check-in
    this.broadcastPresenceUpdate('checked_in', context.venue);

    // Show venue-specific actions
    return {
      showCheckInConfirmation: true,
      showNextStopButton: context.hasNextStop,
      actions: ['rateVenue', 'shareCheckIn'],
      venueActions: true
    };
  }

  private async handleRunningLateActions(context: any) {
    // Auto-notify friends about delay
    this.notifyFriendsOfDelay(context.eta, context.delayReason);

    // Adjust plan timing
    this.adjustPlanTiming(context.delay);

    return {
      showETAInput: true,
      showDelayReasonInput: true,
      actions: ['sendDelayMessage', 'updateETA'],
      autoNotifyFriends: true
    };
  }

  private async handleNextSpotActions(context: any) {
    // Auto-trigger move to next venue
    if (context.onMoveToNext) {
      context.onMoveToNext();
    }

    // Update plan progression
    this.planService.moveToNextStop();

    // Broadcast intention to move
    this.broadcastMovementIntent(context.nextVenue);

    return {
      autoMoveToNext: true,
      showNavigation: true,
      actions: ['navigate', 'inviteToNext'],
      navigationTarget: context.nextVenue
    };
  }

  private async handleCallingItActions(context: any) {
    // End individual participation
    this.planService.completePlan();

    // Remove from active location sharing
    this.disableLocationSharing();

    // Log session completion
    this.logSessionEnd(context.venues);

    return {
      showNightSummary: true,
      actions: ['shareHighlights', 'safeHome'],
      enableSafeHomeNotification: true
    };
  }

  private enableLocationSharing() {
    console.log('🗺️ Enabling location sharing');
    // Trigger location sharing prompt
    const event = new CustomEvent('enableLocationSharing');
    window.dispatchEvent(event);
  }

  private disableLocationSharing() {
    console.log('🗺️ Disabling location sharing');
    const event = new CustomEvent('disableLocationSharing');
    window.dispatchEvent(event);
  }

  private broadcastLocationUpdate(status: string) {
    console.log('📍 Broadcasting location update:', status);
    const event = new CustomEvent('locationUpdate', {
      detail: { status, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(event);
  }

  private broadcastPresenceUpdate(status: string, venue?: any) {
    console.log('👥 Broadcasting presence update:', status, venue?.name);
    const event = new CustomEvent('presenceUpdate', {
      detail: { status, venue, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(event);
  }

  private broadcastMovementIntent(nextVenue?: any) {
    console.log('🚶 Broadcasting movement intent to:', nextVenue?.name);
    const event = new CustomEvent('movementIntent', {
      detail: { nextVenue, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(event);
  }

  private notifyFriendsOfDelay(eta?: string, reason?: string) {
    const message = `Running late! ${eta ? `New ETA: ${eta}` : ''} ${reason ? `Reason: ${reason}` : ''}`.trim();
    
    this.notificationService.addNotification({
      type: 'plan-update',
      title: 'Delay Notification Sent',
      message: `Friends notified: ${message}`
    });

    console.log('⏰ Notifying friends of delay:', message);
  }

  private adjustPlanTiming(delay: number) {
    console.log('📅 Adjusting plan timing by:', delay, 'minutes');
    // Implementation for adjusting estimated times
  }

  private logSessionEnd(venues?: any[]) {
    console.log('📊 Logging session end:', {
      endTime: new Date().toISOString(),
      venuesVisited: venues?.length || 0
    });
  }
}

export default StatusActionService;
