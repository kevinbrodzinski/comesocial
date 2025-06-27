
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSettings = ({ isOpen, onClose }: NotificationSettingsProps) => {
  const { preferences, setPreferences } = useNotificationScheduler();

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about events and friend activity
              </p>
            </div>
            <Switch
              checked={preferences.enabled}
              onCheckedChange={(checked) => updatePreference('enabled', checked)}
            />
          </div>

          <Separator />

          {/* Event Reminders */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Event Reminders</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Remind me before events</Label>
                <Select
                  value={preferences.preEventMinutes.toString()}
                  onValueChange={(value) => updatePreference('preEventMinutes', parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Friend Activity */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Friend Activity</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Friend check-ins</Label>
                  <p className="text-xs text-muted-foreground">When friends check in nearby</p>
                </div>
                <Switch
                  checked={preferences.friendAlerts}
                  onCheckedChange={(checked) => updatePreference('friendAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Location alerts</Label>
                  <p className="text-xs text-muted-foreground">When you enter venues with friends</p>
                </div>
                <Switch
                  checked={preferences.locationAlerts}
                  onCheckedChange={(checked) => updatePreference('locationAlerts', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Venue Updates */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Venue Updates</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Crowd threshold alerts</Label>
                  <p className="text-xs text-muted-foreground">When venues hit peak buzz</p>
                </div>
                <Switch
                  checked={preferences.crowdThreshold}
                  onCheckedChange={(checked) => updatePreference('crowdThreshold', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Do Not Disturb */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Do Not Disturb</Label>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label className="text-sm">From</Label>
                <Select
                  value={preferences.dndStart}
                  onValueChange={(value) => updatePreference('dndStart', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="22:00">10:00 PM</SelectItem>
                    <SelectItem value="23:00">11:00 PM</SelectItem>
                    <SelectItem value="00:00">12:00 AM</SelectItem>
                    <SelectItem value="01:00">1:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Label className="text-sm">To</Label>
                <Select
                  value={preferences.dndEnd}
                  onValueChange={(value) => updatePreference('dndEnd', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettings;
