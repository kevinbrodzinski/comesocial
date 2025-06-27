
class NavigationService {
  private static instance: NavigationService;
  private navigationCallbacks: Map<string, (data: any) => void> = new Map();

  static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  registerCallback(key: string, callback: (data: any) => void) {
    this.navigationCallbacks.set(key, callback);
  }

  unregisterCallback(key: string) {
    this.navigationCallbacks.delete(key);
  }

  navigateToMapWithVenue(venueId: number, venueName?: string) {
    const callback = this.navigationCallbacks.get('mapNavigation');
    if (callback) {
      callback({ type: 'centerOnVenue', venueId, venueName });
    }
  }

  navigateToMapWithFriend(friendId: number, friendName?: string) {
    const callback = this.navigationCallbacks.get('mapNavigation');
    if (callback) {
      callback({ type: 'centerOnFriend', friendId, friendName });
    }
  }

  navigateToMapWithNearbyFriends() {
    const callback = this.navigationCallbacks.get('mapNavigation');
    if (callback) {
      callback({ type: 'showNearbyFriends' });
    }
  }

  openDeviceDirections(latitude: number, longitude: number, venueName: string) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let url: string;
    
    if (isIOS) {
      url = `maps://maps.google.com/maps?daddr=${latitude},${longitude}&dirflg=d`;
    } else if (isAndroid) {
      url = `google.navigation:q=${latitude},${longitude}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
    
    // Fallback to web if native apps fail
    try {
      window.open(url, '_system');
    } catch (error) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodeURIComponent(venueName)}`, '_blank');
    }
  }
}

export default NavigationService;
