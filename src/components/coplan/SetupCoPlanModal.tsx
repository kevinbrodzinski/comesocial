
import React, { useState } from 'react';
import { X, Users, Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Friend } from '@/data/friendsData';
import { cn } from '@/lib/utils';
import FriendChip from './FriendChip';
import PlanTypeCarousel from './PlanTypeCarousel';

interface SetupCoPlanModalProps {
  selectedFriends: Friend[];
  onRemoveFriend: (friend: Friend) => void;
  onCreateDraft: (data: { description: string; planType: string | null }) => void;
  onBack: () => void;
}

const planTypes = [
  { id: 'dinner-drinks', label: 'Dinner & Drinks', emoji: '🍽️' },
  { id: 'birthday', label: 'Birthday Celebration', emoji: '🎉' },
  { id: 'concert', label: 'Concert Night', emoji: '🎵' },
  { id: 'casual-hangout', label: 'Casual Hangout', emoji: '☕' },
  { id: 'night-out', label: 'Night Out', emoji: '🌙' },
  { id: 'special-event', label: 'Special Event', emoji: '✨' },
  { id: 'brunch-meetup', label: 'Brunch Meet-up', emoji: '🥐' },
  { id: 'coffee-work', label: 'Coffee & Work', emoji: '☕' },
  { id: 'day-trip', label: 'Day Trip', emoji: '🚗' },
  { id: 'fitness-class', label: 'Fitness Class', emoji: '💪' },
  { id: 'farmers-market', label: 'Farmers Market', emoji: '🥕' },
  { id: 'study-session', label: 'Study Session', emoji: '📚' }
];

const SetupCoPlanModal = ({ 
  selectedFriends, 
  onRemoveFriend, 
  onCreateDraft, 
  onBack 
}: SetupCoPlanModalProps) => {
  const [description, setDescription] = useState('');
  const [selectedPlanType, setSelectedPlanType] = useState<string | null>(null);
  const [showAllPlanTypes, setShowAllPlanTypes] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 360);

  React.useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 360);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreateDraft = () => {
    if (!description.trim()) return;
    onCreateDraft({ description: description.trim(), planType: selectedPlanType });
  };

  const topPlanTypes = planTypes.slice(0, 4);
  const hasDescription = description.trim().length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="w-10" />
          <h1 className="font-semibold">Setup Co-Plan</h1>
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X size={20} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 max-w-2xl mx-auto space-y-6 pb-24">
        {/* Selected Friends */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Users size={18} className="text-muted-foreground" />
              <span className="font-medium">Co-planning with</span>
              <Badge variant="secondary">{selectedFriends.length} friends</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFriends.map((friend) => (
                <FriendChip
                  key={friend.id}
                  friend={friend}
                  onRemove={onRemoveFriend}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-medium mb-2">What's this plan about?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Give your friends an idea of what you want to plan together
              </p>
              <Textarea
                placeholder="e.g., Let's plan Sarah's birthday celebration! Thinking dinner followed by drinks and maybe dancing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(
                  "min-h-24 transition-all duration-200 text-base md:text-sm",
                  hasDescription 
                    ? "bg-surface-2 border-0" 
                    : "border-primary/30 bg-transparent"
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Plan Type Selection */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-medium mb-2">Plan Type</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Choose a category to help guide the planning
              </p>
              
              {isSmallScreen ? (
                <PlanTypeCarousel
                  planTypes={planTypes}
                  selectedPlanType={selectedPlanType}
                  onSelectPlanType={setSelectedPlanType}
                />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {topPlanTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant={selectedPlanType === type.id ? "default" : "outline"}
                        onClick={() => setSelectedPlanType(type.id)}
                        className="h-auto p-3 flex flex-col items-center space-y-1"
                      >
                        <span className="text-lg">{type.emoji}</span>
                        <span className="text-xs text-center">{type.label}</span>
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowAllPlanTypes(true)}
                    className="w-full rounded-full"
                  >
                    <Plus size={16} className="mr-2" />
                    More...
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 pb-safe">
        <Button 
          onClick={handleCreateDraft}
          className="w-full h-12"
          size="lg"
          disabled={!description.trim()}
        >
          <Send size={16} className="mr-2" />
          Create Co-Plan
        </Button>
      </div>

      {/* Full Plan Types Sheet */}
      <Sheet open={showAllPlanTypes} onOpenChange={setShowAllPlanTypes}>
        <SheetContent side="bottom" className="h-[70vh]">
          <SheetHeader>
            <SheetTitle>Choose Plan Type</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {planTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedPlanType === type.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedPlanType(type.id);
                  setShowAllPlanTypes(false);
                }}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <span className="text-2xl">{type.emoji}</span>
                <span className="text-sm text-center">{type.label}</span>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SetupCoPlanModal;
