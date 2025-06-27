
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Share2, MoreVertical } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobilePlanHeaderProps {
  planName: string;
  planDate: string;
  planTime: string;
  stopsCount: number;
  onClose: () => void;
  onShare?: () => void;
}

const MobilePlanHeader = ({ 
  planName, 
  planDate, 
  planTime, 
  stopsCount, 
  onClose,
  onShare
}: MobilePlanHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="sticky top-0 z-40 bg-background border-b border-border">
      {/* Mobile Header Bar */}
      <div className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="h-10 w-10 p-0"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <div className="flex-1 text-center">
          <h1 className="font-semibold text-lg truncate">Edit Plan</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {onShare && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onShare}
              className="h-10 w-10 p-0"
            >
              <Share2 size={18} />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            className="h-10 w-10 p-0"
          >
            <MoreVertical size={18} />
          </Button>
        </div>
      </div>

      {/* Plan Info Card */}
      <div className="px-4 pb-4">
        <Card className="bg-card border light-card-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground mb-1 truncate">
                  {planName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {planDate} at {planTime}
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className="bg-primary/10 text-primary border-primary/20 whitespace-nowrap"
              >
                {stopsCount} stops
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobilePlanHeader;
