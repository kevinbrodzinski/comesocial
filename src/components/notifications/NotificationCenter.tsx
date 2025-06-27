
import React, { useState } from 'react';
import { Bell, BellRing, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import SmartAlert from './SmartAlert';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const {
    notifications,
    isEnabled,
    setIsEnabled,
    dismissNotification,
    clearAllNotifications
  } = useNotificationSystem();

  const handleAlertAction = (alertId: string) => {
    console.log('Alert action triggered:', alertId);
    dismissNotification(alertId);
  };

  const unreadCount = notifications.length;

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 h-10 w-10 p-0 bg-background/80 backdrop-blur-sm border border-border hover:bg-muted/50 transition-all"
      >
        {unreadCount > 0 ? (
          <div className="relative">
            <BellRing size={18} className="text-primary" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-red-500">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          </div>
        ) : (
          <Bell size={18} />
        )}
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="max-w-md mx-auto mt-16">
        <Card className="bg-background/95 backdrop-blur-sm border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="h-8 w-8 p-0"
                >
                  <Settings size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
            
            {showSettings && (
              <>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-sm">
                  <span>Enable notifications</span>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={setIsEnabled}
                  />
                </div>
                {notifications.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="w-full mt-2"
                  >
                    Clear all
                  </Button>
                )}
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs mt-1">We'll keep you updated on the nightlife scene</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <SmartAlert
                  key={notification.id}
                  alert={{
                    id: notification.id,
                    type: notification.type as any,
                    title: notification.title,
                    message: notification.message,
                    venue: notification.venue,
                    urgency: notification.urgency,
                    actionLabel: notification.actionLabel,
                    crowdLevel: notification.crowdLevel,
                    friendsCount: notification.friendName ? 1 : undefined
                  }}
                  onAction={() => handleAlertAction(notification.id)}
                  onDismiss={() => dismissNotification(notification.id)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationCenter;
