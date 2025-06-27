import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FriendsErrorStateProps {
  error: Error | null;
  onRetry?: () => void;
}

const FriendsErrorState: React.FC<FriendsErrorStateProps> = ({ error, onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Fallback: reload the page
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <span className="text-2xl">⚠️</span>
          </div>
          <CardTitle className="text-lg">Unable to Load Friends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <span className="mr-2">⚠️</span>
            <AlertDescription>
              {error?.message || 'There was an error loading your friends. Please try again.'}
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleRetry}
              className="w-full"
              variant="default"
            >
              <span className="mr-2">🔄</span>
              Try Again
            </Button>
            
            <Button 
              onClick={() => window.location.reload()}
              className="w-full"
              variant="outline"
            >
              Refresh Page
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            If the problem persists, please check your internet connection or contact support.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsErrorState; 