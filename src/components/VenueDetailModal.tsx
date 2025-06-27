
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, Users, Star, Heart, Share2, Navigation } from 'lucide-react';
import QuickPlanActions from './plan/QuickPlanActions';
import SmartPlanSuggestions from './plan/SmartPlanSuggestions';
import { useToast } from '@/hooks/use-toast';

interface VenueDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: any;
}

const VenueDetailModal = ({ open, onOpenChange, venue }: VenueDetailModalProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  if (!venue) return null;

  const handleQuickPlan = (planData: any) => {
    console.log('Creating quick plan:', planData);
    // Would integrate with actual plan creation logic
    onOpenChange(false);
  };

  const handleAddToPlan = (venueToAdd: any) => {
    console.log('Adding to plan:', venueToAdd);
    // Would integrate with actual plan logic
  };

  const handleAddVenue = (newVenue: any) => {
    console.log('Adding venue:', newVenue);
    setShowSuggestions(false);
  };

  const handleCreateFullPlan = (venues: any[]) => {
    console.log('Creating full plan with venues:', venues);
    onOpenChange(false);
  };

  const handleInviteFriends = () => {
    toast({
      title: "Friend Invite",
      description: "Opening friend selector...",
    });
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
              <Button variant="ghost" size="sm">
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
                <span>4.2</span>
                <span className="text-muted-foreground">(128 reviews)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin size={14} className="text-muted-foreground" />
                <span>0.3 mi away</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={14} className="text-muted-foreground" />
                <span>Open until 2 AM</span>
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

          {/* Quick Actions */}
          <QuickPlanActions
            venue={venue}
            onQuickPlan={handleQuickPlan}
            onAddToPlan={handleAddToPlan}
            onInviteFriends={handleInviteFriends}
          />

          {/* Smart Suggestions Toggle */}
          {!showSuggestions && (
            <Button
              variant="outline"
              onClick={() => setShowSuggestions(true)}
              className="w-full"
            >
              Get Smart Plan Suggestions
            </Button>
          )}

          {/* Smart Suggestions */}
          {showSuggestions && (
            <SmartPlanSuggestions
              baseVenue={venue}
              onAddVenue={handleAddVenue}
              onCreateFullPlan={handleCreateFullPlan}
            />
          )}

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
                Great rooftop bar with amazing city views. Known for craft cocktails and live DJ sets on weekends.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Features</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">Rooftop</Badge>
                  <Badge variant="secondary">Live Music</Badge>
                  <Badge variant="secondary">Craft Cocktails</Badge>
                  <Badge variant="secondary">City Views</Badge>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="photos">
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="aspect-square bg-muted rounded-lg"></div>
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
                    Amazing views and great cocktails! Perfect for a date night.
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

export default VenueDetailModal;
