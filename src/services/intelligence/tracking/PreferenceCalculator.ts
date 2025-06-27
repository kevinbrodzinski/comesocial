
export class PreferenceCalculator {
  calculateUserPreferences(events: any[]): {
    venueTypes: Record<string, number>;
    timePreferences: Record<string, number>;
    socialPatterns: Record<string, number>;
    locationPreferences: Record<string, number>;
  } {
    const venueInteractions = this.getEventsByType(events, 'venue_interaction');
    const timingEvents = this.getEventsByType(events, 'timing_preference');
    const friendEvents = this.getEventsByType(events, 'friend_response');
    const locationEvents = this.getEventsByType(events, 'location_pattern');

    return {
      venueTypes: this.calculateVenueTypePreferences(venueInteractions),
      timePreferences: this.calculateTimePreferences(timingEvents),
      socialPatterns: this.calculateSocialPatterns(friendEvents),
      locationPreferences: this.calculateLocationPreferences(locationEvents)
    };
  }

  private getEventsByType(events: any[], type: string): any[] {
    return events.filter(event => event.type === type);
  }

  private calculateVenueTypePreferences(events: any[]): Record<string, number> {
    const venueTypes: Record<string, number> = {};
    events.forEach(event => {
      const venueType = event.data.venueType || 'unknown';
      const action = event.data.action;
      const weight = this.getActionWeight(action);
      venueTypes[venueType] = (venueTypes[venueType] || 0) + weight;
    });
    return venueTypes;
  }

  private calculateTimePreferences(events: any[]): Record<string, number> {
    const timePreferences: Record<string, number> = {};
    events.forEach(event => {
      const time = event.data.preferredTime;
      const outcome = event.data.outcome;
      const weight = outcome === 'perfect' ? 2 : outcome === 'successful' ? 1 : -0.5;
      timePreferences[time] = (timePreferences[time] || 0) + weight;
    });
    return timePreferences;
  }

  private calculateSocialPatterns(events: any[]): Record<string, number> {
    const socialPatterns: Record<string, number> = {};
    events.forEach(event => {
      const pattern = `${event.data.responseType}_${event.context.friendsNearby || 0}`;
      socialPatterns[pattern] = (socialPatterns[pattern] || 0) + 1;
    });
    return socialPatterns;
  }

  private calculateLocationPreferences(events: any[]): Record<string, number> {
    const locationPreferences: Record<string, number> = {};
    events.forEach(event => {
      const area = this.getAreaFromLocation(event.data.toLocation);
      locationPreferences[area] = (locationPreferences[area] || 0) + 1;
    });
    return locationPreferences;
  }

  private getActionWeight(action: string): number {
    const weights: Record<string, number> = {
      'check_in': 3,
      'visit': 2,
      'save': 1.5,
      'like': 1,
      'view': 0.5,
      'share': 2
    };
    return weights[action] || 0.5;
  }

  private getAreaFromLocation(location: any): string {
    if (!location) return 'unknown';
    return `${Math.floor(location.lat * 100)}_${Math.floor(location.lng * 100)}`;
  }
}

export const preferenceCalculator = new PreferenceCalculator();
