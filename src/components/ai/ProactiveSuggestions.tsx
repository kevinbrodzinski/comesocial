
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, TrendingUp, Clock, Users, MapPin, Star } from 'lucide-react';
import { useProactiveAI } from '../../hooks/useProactiveAI';

interface ProactiveSuggestionsProps {
  compact?: boolean;
  showNotifications?: boolean;
  maxSuggestions?: number;
  onSuggestionAction?: (suggestionId: string, action: string) => void;
}

const ProactiveSuggestions = ({ 
  compact = false, 
  showNotifications = true,
  maxSuggestions = 3,
  onSuggestionAction 
}: ProactiveSuggestionsProps) => {
  const {
    suggestions,
    notifications,
    confidence,
    isActive,
    trackSuggestionInteraction,
    getHighPriorityNotifications
  } = useProactiveAI();

  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set());

  // Filter out dismissed items
  const activeSuggestions = suggestions
    .filter(s => !dismissedSuggestions.has(s.id))
    .slice(0, maxSuggestions);

  const activeNotifications = showNotifications 
    ? getHighPriorityNotifications().filter(n => !dismissedNotifications.has(n.id))
    : [];

  if (!isActive || (activeSuggestions.length === 0 && activeNotifications.length === 0)) {
    return null;
  }

  const handleSuggestionAction = (suggestion: any, action: 'accept' | 'dismiss') => {
    if (action === 'accept') {
      trackSuggestionInteraction(suggestion.id, 'accepted');
      if (suggestion.onAction) {
        suggestion.onAction();
      }
      onSuggestionAction?.(suggestion.id, 'accepted');
    } else {
      trackSuggestionInteraction(suggestion.id, 'dismissed');
      setDismissedSuggestions(prev => new Set([...prev, suggestion.id]));
      onSuggestionAction?.(suggestion.id, 'dismissed');
    }
  };

  const handleNotificationDismiss = (notificationId: string) => {
    setDismissedNotifications(prev => new Set([...prev, notificationId]));
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'venue': return <MapPin size={16} className="text-purple-500" />;
      case 'timing': return <Clock size={16} className="text-blue-500" />;
      case 'social': return <Users size={16} className="text-green-500" />;
      case 'trend': return <TrendingUp size={16} className="text-orange-500" />;
      default: return <Star size={16} className="text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {/* Compact notification banner */}
        {activeNotifications.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-900">
                  {activeNotifications[0].title}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleNotificationDismiss(activeNotifications[0].id)}
                className="h-6 w-6 p-0"
              >
                <X size={12} />
              </Button>
            </div>
            <p className="text-xs text-blue-700 mt-1">{activeNotifications[0].message}</p>
          </div>
        )}

        {/* Compact suggestions */}
        {activeSuggestions.slice(0, 1).map((suggestion) => (
          <div key={suggestion.id} className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getSuggestionIcon(suggestion.type)}
                <div>
                  <span className="text-sm font-medium">{suggestion.title}</span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 text-xs ${getConfidenceColor(suggestion.confidence)}`}
                  >
                    {Math.round(suggestion.confidence * 100)}%
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-1">
                {suggestion.actionLabel && (
                  <Button
                    size="sm"
                    onClick={() => handleSuggestionAction(suggestion, 'accept')}
                    className="h-7 px-2 text-xs"
                  >
                    {suggestion.actionLabel}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSuggestionAction(suggestion, 'dismiss')}
                  className="h-7 w-7 p-0"
                >
                  <X size={12} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* System confidence indicator */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>AI Suggestions</span>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${confidence > 0.7 ? 'bg-green-500' : confidence > 0.4 ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
          <span>{Math.round(confidence * 100)}% confident</span>
        </div>
      </div>

      {/* High priority notifications */}
      {activeNotifications.map((notification) => (
        <Card key={notification.id} className="border-l-4 border-l-red-500 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-red-900">{notification.title}</span>
                  <Badge variant="destructive" className="text-xs">
                    {notification.priority}
                  </Badge>
                </div>
                <p className="text-sm text-red-800 mb-3">{notification.message}</p>
                {notification.actionLabel && (
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      if (notification.action) notification.action();
                      handleNotificationDismiss(notification.id);
                    }}
                  >
                    {notification.actionLabel}
                  </Button>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleNotificationDismiss(notification.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
              >
                <X size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Proactive suggestions */}
      {activeSuggestions.map((suggestion) => (
        <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getSuggestionIcon(suggestion.type)}
                  <span className="font-semibold">{suggestion.title}</span>
                  <Badge 
                    variant="secondary" 
                    className={getConfidenceColor(suggestion.confidence)}
                  >
                    {Math.round(suggestion.confidence * 100)}% match
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{suggestion.message}</p>
                
                {/* Suggestion metadata */}
                {suggestion.metadata && Object.keys(suggestion.metadata).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(suggestion.metadata).slice(0, 3).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  {suggestion.actionLabel && (
                    <Button
                      size="sm"
                      onClick={() => handleSuggestionAction(suggestion, 'accept')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {suggestion.actionLabel}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSuggestionAction(suggestion, 'dismiss')}
                  >
                    Not now
                  </Button>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSuggestionAction(suggestion, 'dismiss')}
                className="h-8 w-8 p-0 ml-2"
              >
                <X size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* No suggestions state */}
      {activeSuggestions.length === 0 && activeNotifications.length === 0 && confidence > 0.3 && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground">
              <Star size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No suggestions right now</p>
              <p className="text-xs mt-1">I'm learning your preferences...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProactiveSuggestions;
