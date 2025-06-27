
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, Users, Star, Heart, Share2, Navigation, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UnifiedVenueDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: any;
  onAddToPlan?: (venue: any) => void;
  onStartPlan?: (venue: any) => void;
}

const UnifiedVenueDetailModal = ({ 
  open, 
  onOpenChange, 
  venue,
  onAddToPlan,
  onStartPlan
}: UnifiedVenueDetailModalProps) => {
  const { toast } = useToast();

  if (!venue) return null;

  const handleAddToPlan = () => {
    onAddToPlan?.(venue);
    toast({
      title: "Added to Plan",
      description: `${venue.name} has been added to your plan`,
    });
    onOpenChange(false);
  };

  const handleStartPlan = () => {
    onStartPlan?.(venue);
    toast({
      title: "Plan Started",
      description: `Created new plan starting at ${venue.name}`,
    });
    onOpenChange(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: venue.name,
        text: `Check out ${venue.name}!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Venue link copied to clipboard",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{venue.name}</span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Heart size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 size={16} />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Venue Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{venue.type || 'Venue'}</Badge>
              <div className="flex items-center space-x-1 text-sm">
                <Star size={14} className="text-yellow-500" />
                <span>{venue.rating || '4.2'}</span>
                <span className="text-muted-foreground">
                  ({venue.review_count || '128'} reviews)
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin size={14} className="text-muted-foreground" />
                <span>{venue.distance || '0.3 mi away'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={14} className="text-muted-foreground" />
                <span>{venue.is_open_now ? 'Open now' : 'Closed'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={14} className="text-muted-foreground" />
                <span>Moderate crowd</span>
              </div>
              <div className="flex items-center space-x-2">
                <Navigation size={14} className="text-muted-foreground" />
                <span>5 min walk</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quick Plan Actions */}
          <div className="bg-secondary/20 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">Quick Actions</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleAddToPlan}
              >
                <Plus size={14} className="mr-2" />
                Add to Existing Plan
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleStartPlan}
              >
                <Plus size={14} className="mr-2" />
                Start New Plan
              </Button>
            </div>
          </div>

          <Separator />

          {/* Tabs for additional info */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {venue.description || 'Great venue with amazing atmosphere. Perfect for a night out with friends.'}
              </p>
              
              {venue.location?.address && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Address</h4>
                  <p className="text-sm text-muted-foreground">{venue.location.address}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Features</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">Popular</Badge>
                  <Badge variant="secondary">Good for Groups</Badge>
                  <Badge variant="secondary">Late Night</Badge>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="photos">
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Photo 1</span>
                </div>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Photo 2</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Sarah M.</span>
                    <div className="flex items-center space-x-1">
                      <Star size={12} className="text-yellow-500" />
                      <span className="text-xs">5.0</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Amazing atmosphere and great service! Perfect for a night out.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedVenueDetailModal;
