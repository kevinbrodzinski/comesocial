
import React from 'react';
import { Plus, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyFeedStateProps {
  onCreatePost: () => void;
}

const EmptyFeedState = ({ onCreatePost }: EmptyFeedStateProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="max-w-sm w-full text-center border-dashed border-2 border-muted-foreground/25">
        <CardContent className="p-8">
          <div className="mb-4">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No one's posted yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Be the first to check in and share what's happening at your spot.
          </p>
          <Button onClick={onCreatePost} className="w-full">
            <Plus size={16} className="mr-2" />
            Create First Post
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyFeedState;
