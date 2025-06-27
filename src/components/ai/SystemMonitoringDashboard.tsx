
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { errorHandler } from '@/services/intelligence/ErrorHandler';
import { eventTracker } from '@/services/intelligence/EventTracker';

export const SystemMonitoringDashboard: React.FC = () => {
  const [errorStats, setErrorStats] = useState<any>(null);
  const [unresolvedErrors, setUnresolvedErrors] = useState<any[]>([]);
  const [eventStats, setEventStats] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    
    // Get error statistics
    const stats = errorHandler.getErrorStats();
    setErrorStats(stats);
    
    // Get unresolved errors
    const errors = errorHandler.getUnresolvedErrors();
    setUnresolvedErrors(errors.slice(0, 10)); // Show top 10
    
    // Get event statistics
    const recentEvents = eventTracker.getEventsInTimeWindow(24);
    const eventTypeCount = recentEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    setEventStats({
      totalEvents: recentEvents.length,
      byType: eventTypeCount
    });
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getErrorTypeIcon = (type: string) => {
    switch (type) {
      case 'validation': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'ai_call': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'prediction': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Monitoring</h2>
        <Button 
          onClick={refreshData} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {errorStats?.resolved || 0} resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Retryable Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorStats?.retryable || 0}</div>
            <p className="text-xs text-muted-foreground">
              Can be automatically retried
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventStats?.totalEvents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Breakdown */}
      {errorStats?.byType && (
        <Card>
          <CardHeader>
            <CardTitle>Error Breakdown</CardTitle>
            <CardDescription>Errors by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(errorStats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getErrorTypeIcon(type)}
                    <span className="capitalize">{type.replace('_', ' ')}</span>
                  </div>
                  <Badge variant="outline">{count as number}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Unresolved Errors */}
      {unresolvedErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Unresolved Errors</CardTitle>
            <CardDescription>Errors that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unresolvedErrors.map((error) => (
                <div key={error.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getErrorTypeIcon(error.type)}
                      <span className="font-medium">{error.message}</span>
                    </div>
                    <Badge variant="outline">
                      {error.context.component}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Operation: {error.context.operation}</div>
                    <div>Time: {new Date(error.context.timestamp).toLocaleTimeString()}</div>
                    {error.retryCount && (
                      <div>Retries: {error.retryCount}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Statistics */}
      {eventStats?.byType && (
        <Card>
          <CardHeader>
            <CardTitle>Event Activity</CardTitle>
            <CardDescription>Events tracked in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(eventStats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                  <Badge variant="outline">{count as number}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
