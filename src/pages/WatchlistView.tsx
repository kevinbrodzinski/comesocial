
import React from 'react';
import { ArrowLeft, Eye, Bell, Users, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useWatchlistData } from '../hooks/useWatchlistData';

const WatchlistView = ({ onBack }: { onBack?: () => void }) => {
  const {
    watchedEvents,
    notifications,
    currentView,
    setCurrentView,
    unreadCount,
    actionRequiredCount,
    markNotificationAsRead,
    dismissNotification,
    joinFromWatchlist,
    unwatchEvent
  } = useWatchlistData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500 text-white';
      case 'upcoming': return 'bg-blue-500 text-white';
      case 'ending-soon': return 'bg-orange-500 text-white';
      case 'ended': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live': return 'Live Now';
      case 'upcoming': return 'Starting Soon';
      case 'ending-soon': return 'Ending Soon';
      case 'ended': return 'Ended';
      default: return status;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friends-joined': return <Users size={14} />;
      case 'crowd-threshold': return <Eye size={14} />;
      case 'event-starting': return <Clock size={14} />;
      default: return <Bell size={14} />;
    }
  };

  const getNotificationColor = (type: string, actionRequired: boolean) => {
    if (actionRequired) return 'border-primary/50 bg-primary/5';
    switch (type) {
      case 'friends-joined': return 'border-blue-200 bg-blue-50';
      case 'crowd-threshold': return 'border-green-200 bg-green-50';
      case 'event-starting': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          )}
          
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">My Watchlist</h1>
            <p className="text-sm text-muted-foreground">
              {currentView === 'events' ? `${watchedEvents.length} events watching` : `${notifications.length} notifications`}
            </p>
          </div>
          
          <div className="w-16" /> {/* Spacer for center alignment */}
        </div>

        {/* Toggle Tabs */}
        <div className="px-4 pb-3">
          <div className="flex bg-secondary/30 rounded-lg p-1">
            <Button
              variant={currentView === 'events' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('events')}
              className="flex-1 h-8"
            >
              <Eye size={14} className="mr-2" />
              Events
            </Button>
            <Button
              variant={currentView === 'notifications' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('notifications')}
              className="flex-1 h-8 relative"
            >
              <Bell size={14} className="mr-2" />
              Alerts
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {currentView === 'events' ? (
          // Watched Events View
          <>
            {watchedEvents.length === 0 ? (
              <div className="text-center py-12">
                <Eye size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No events watched yet</h3>
                <p className="text-muted-foreground">
                  Start watching events from the feed to see them here
                </p>
              </div>
            ) : (
              watchedEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.venue}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className={getStatusColor(event.status)}>
                        {getStatusLabel(event.status)}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/60 text-white">
                        <Users size={10} className="mr-1" />
                        {event.crowdLevel}%
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{event.venue}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{event.type}</Badge>
                          <Badge variant="outline" className="text-xs">{event.vibe}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => unwatchEvent(event.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Eye size={14} />
                      </Button>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock size={12} className="mr-1" />
                          {event.startTime} - {event.endTime}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin size={12} className="mr-1" />
                          {event.distance}
                        </div>
                      </div>

                      {event.friendsCount > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-1">
                            {event.friendsAvatars.slice(0, 3).map((avatar, index) => (
                              <Avatar key={index} className="w-5 h-5 border border-background">
                                <AvatarImage src={avatar} />
                                <AvatarFallback className="text-xs">F</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {event.friendsCount} friends here
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Last updated {event.lastUpdate} • {event.totalAttendees} people here
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => joinFromWatchlist(event.id)}
                        className="flex-1"
                      >
                        Join Now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('View details:', event.id)}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        ) : (
          // Notifications View
          <>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">
                  We'll notify you about updates to your watched events
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`border ${getNotificationColor(notification.type, notification.actionRequired)} ${!notification.isRead ? 'shadow-md' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${notification.actionRequired ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{notification.eventName}</h4>
                            <p className="text-sm text-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.timestamp}
                            </p>
                          </div>
                          
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>

                        {notification.actionRequired && !notification.isRead && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => {
                                joinFromWatchlist(notification.eventId);
                                markNotificationAsRead(notification.id);
                              }}
                              className="text-xs"
                            >
                              Join Now
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="text-xs"
                            >
                              Mark Read
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => dismissNotification(notification.id)}
                              className="text-xs text-muted-foreground"
                            >
                              Dismiss
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WatchlistView;
