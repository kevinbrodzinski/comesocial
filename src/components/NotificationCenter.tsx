
import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Users, MapPin, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface NotificationCenterProps {
  planData: any;
  onSendNotification: (type: string, recipients: string[], data: any) => void;
}

const NotificationCenter = ({ planData, onSendNotification }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState([]);
  const [autoNotifications, setAutoNotifications] = useState(true);
  const { toast } = useToast();

  // Mock notification types for plan updates
  const notificationTypes = {
    plan_created: {
      icon: Check,
      title: "Plan Created",
      message: `"${planData.name}" is ready to share!`,
      color: "text-green-600"
    },
    friend_joined: {
      icon: Users,
      title: "Friend Joined",
      message: "Someone new joined your plan",
      color: "text-blue-600"
    },
    venue_suggestion: {
      icon: MapPin,
      title: "Venue Suggestion",
      message: "New venue recommended for your plan",
      color: "text-purple-600"
    },
    payment_reminder: {
      icon: DollarSign,
      title: "Payment Reminder",
      message: "Payment split ready for confirmation",
      color: "text-orange-600"
    },
    plan_starting: {
      icon: Clock,
      title: "Plan Starting Soon",
      message: "Your plan starts in 30 minutes!",
      color: "text-red-600"
    }
  };

  // Auto-generate notifications based on plan progress
  useEffect(() => {
    const newNotifications = [];

    if (planData.name && planData.stops.length > 0) {
      newNotifications.push({
        id: Date.now() + 1,
        type: 'plan_created',
        timestamp: new Date(),
        dismissed: false
      });
    }

    if (planData.invitedFriends.length > 0) {
      newNotifications.push({
        id: Date.now() + 2,
        type: 'friend_joined',
        timestamp: new Date(),
        dismissed: false,
        count: planData.invitedFriends.length
      });
    }

    if (planData.splitPayment) {
      newNotifications.push({
        id: Date.now() + 3,
        type: 'payment_reminder',
        timestamp: new Date(),
        dismissed: false
      });
    }

    setNotifications(newNotifications);
  }, [planData]);

  const dismissNotification = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, dismissed: true } : notif
      )
    );
  };

  const sendPlanUpdateNotification = (updateType: string) => {
    const recipients = planData.invitedFriends.map(friend => friend.email || `${friend.name}@example.com`);
    
    const updateMessages = {
      venue_added: `New venue added to "${planData.name}": ${planData.stops[planData.stops.length - 1]}`,
      time_changed: `Time updated for "${planData.name}": ${planData.time}`,
      location_set: `Meetup location set for "${planData.name}": ${planData.meetupLocation}`,
      cost_updated: `Cost estimate updated for "${planData.name}": $${planData.estimatedCost}/person`
    };

    onSendNotification(updateType, recipients, {
      planName: planData.name,
      message: updateMessages[updateType],
      planDate: planData.date,
      planTime: planData.time
    });

    toast({
      title: "Notifications Sent",
      description: `Updated ${recipients.length} friends about plan changes`
    });
  };

  const schedulePrePlanReminders = () => {
    // This would integrate with a notification service
    const reminderTimes = [
      { time: '24h', message: 'Your plan is tomorrow!' },
      { time: '2h', message: 'Plan starts in 2 hours - get ready!' },
      { time: '30m', message: 'Time to head out! Plan starts soon.' }
    ];

    reminderTimes.forEach(reminder => {
      // Schedule notification
      console.log(`Scheduling reminder: ${reminder.message} at ${reminder.time} before plan`);
    });

    toast({
      title: "Reminders Scheduled",
      description: "All attendees will get timely updates about the plan"
    });
  };

  const activeNotifications = notifications.filter(notif => !notif.dismissed);

  return (
    <div className="space-y-4">
      {activeNotifications.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center">
                <Bell size={16} className="mr-2" />
                Plan Updates
              </h4>
              <Badge variant="secondary">{activeNotifications.length}</Badge>
            </div>
            
            <div className="space-y-2">
              {activeNotifications.map(notification => {
                const config = notificationTypes[notification.type];
                const IconComponent = config.icon;
                
                return (
                  <div key={notification.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center">
                      <IconComponent size={14} className={`mr-2 ${config.color}`} />
                      <div>
                        <span className="text-sm font-medium">{config.title}</span>
                        <p className="text-xs text-muted-foreground">{config.message}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="font-medium">Notification Settings</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Auto-notify friends of changes</span>
            <button
              onClick={() => setAutoNotifications(!autoNotifications)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                autoNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  autoNotifications ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendPlanUpdateNotification('venue_added')}
              className="w-full justify-start"
            >
              <MapPin size={14} className="mr-2" />
              Notify About Venue Changes
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={schedulePrePlanReminders}
              className="w-full justify-start"
            >
              <Clock size={14} className="mr-2" />
              Schedule Plan Reminders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
