
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, MapPin, Users, Clock, X } from 'lucide-react';
import { useLocationSharingSettings, LocationSharingLevel, LocationAccuracy, LocationTiming } from '@/hooks/useLocationSharingSettings';
import { Friend } from '@/data/friendsData';
import FriendSharingControls from './FriendSharingControls';

interface LocationSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: Friend[];
}

const LocationSharingModal = ({ isOpen, onClose, friends }: LocationSharingModalProps) => {
  const {
    settings,
    updateSettings,
    enableGhostMode,
    disableGhostMode,
    temporaryShares
  } = useLocationSharingSettings();

  if (!isOpen) return null;

  const sharingLevelOptions: { value: LocationSharingLevel; label: string; description: string }[] = [
    { value: 'always', label: 'Everyone', description: 'Share with all app users' },
    { value: 'friends-only', label: 'Friends Only', description: 'Only share with confirmed friends' },
    { value: 'select-friends', label: 'Select Friends', description: 'Choose specific friends to share with' },
    { value: 'plan-only', label: 'Plan Members Only', description: 'Only share with people in your current plan' },
    { value: 'never', label: 'No One', description: 'Keep location completely private' }
  ];

  const accuracyOptions: { value: LocationAccuracy; label: string; description: string }[] = [
    { value: 'exact', label: 'Exact Location', description: 'Share precise GPS coordinates' },
    { value: 'approximate', label: 'Approximate Area', description: 'Share general area (300m radius)' },
    { value: 'city-level', label: 'City Level', description: 'Only share city/neighborhood' }
  ];

  const timingOptions: { value: LocationTiming; label: string; description: string }[] = [
    { value: 'always-open', label: 'Always (when app is open)', description: 'Share whenever the app is active' },
    { value: 'checked-in-only', label: 'Only when checked in', description: 'Share only at venues you check into' },
    { value: 'plan-only', label: 'Only while on a plan', description: 'Share only during active plans' },
    { value: 'manual-only', label: 'Manual only', description: 'Only when you choose to share' }
  ];

  const handleGhostModeToggle = () => {
    if (settings.ghostModeEnabled) {
      disableGhostMode();
    } else {
      enableGhostMode();
    }
  };

  const handleSelectedFriendsChange = (selectedFriends: number[]) => {
    updateSettings({ selectedFriends });
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl border-t border-border max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-background border-b border-border rounded-t-2xl">
          <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-3 mb-2"></div>
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              <h2 className="font-semibold text-lg">Location Sharing</h2>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-8 h-8 p-0"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Ghost Mode */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                {settings.ghostModeEnabled ? (
                  <EyeOff size={16} className="text-orange-600" />
                ) : (
                  <Eye size={16} className="text-green-600" />
                )}
                Ghost Mode
                {settings.ghostModeEnabled && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Temporarily hide your location from all friends while staying online
              </p>
              <div className="flex items-center justify-between">
                <Label htmlFor="ghost-mode">Enable Ghost Mode</Label>
                <Switch
                  id="ghost-mode"
                  checked={settings.ghostModeEnabled}
                  onCheckedChange={handleGhostModeToggle}
                />
              </div>
              {settings.ghostModeEnabled && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => enableGhostMode(30)}
                  >
                    30 min
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => enableGhostMode(60)}
                  >
                    1 hour
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => enableGhostMode(180)}
                  >
                    3 hours
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Who Can See Your Location */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users size={16} className="text-primary" />
                Who Can See Your Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={settings.sharingLevel} 
                onValueChange={(value: LocationSharingLevel) => 
                  updateSettings({ sharingLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sharingLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Select Friends (only show when select-friends is chosen) */}
          {settings.sharingLevel === 'select-friends' && (
            <FriendSharingControls
              friends={friends}
              selectedFriends={settings.selectedFriends}
              onSelectedFriendsChange={handleSelectedFriendsChange}
              mode="select"
            />
          )}

          {/* When to Share */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock size={16} className="text-primary" />
                When to Share Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={settings.timing} 
                onValueChange={(value: LocationTiming) => 
                  updateSettings({ timing: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Location Accuracy */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin size={16} className="text-primary" />
                Location Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={settings.accuracy} 
                onValueChange={(value: LocationAccuracy) => 
                  updateSettings({ accuracy: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accuracyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Friend Overrides */}
          <FriendSharingControls
            friends={friends}
            selectedFriends={[]}
            onSelectedFriendsChange={() => {}}
            mode="overrides"
          />

          {/* Additional Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Smart Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-checkin">Auto Check-in</Label>
                  <p className="text-xs text-muted-foreground">Automatically check in at venues</p>
                </div>
                <Switch
                  id="auto-checkin"
                  checked={settings.autoCheckIn}
                  onCheckedChange={(checked) => updateSettings({ autoCheckIn: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="share-eta">Share ETA</Label>
                  <p className="text-xs text-muted-foreground">Let friends see when you'll arrive</p>
                </div>
                <Switch
                  id="share-eta"
                  checked={settings.shareETA}
                  onCheckedChange={(checked) => updateSettings({ shareETA: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="friend-requests">Allow Location Requests</Label>
                  <p className="text-xs text-muted-foreground">Friends can ask for your location</p>
                </div>
                <Switch
                  id="friend-requests"
                  checked={settings.allowFriendRequests}
                  onCheckedChange={(checked) => updateSettings({ allowFriendRequests: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Temporary Shares */}
          {Object.keys(temporaryShares).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock size={16} className="text-primary" />
                  Temporary Shares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(temporaryShares).map(([friendId, share]) => (
                  <div key={friendId} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Friend #{friendId}</p>
                      <p className="text-xs text-muted-foreground">
                        Expires: {share.expiresAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="h-6"></div>
        </div>
      </div>
    </>
  );
};

export default LocationSharingModal;
