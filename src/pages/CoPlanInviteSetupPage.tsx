import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CoPlanService from '@/services/CoPlanService';
import { Friend } from '@/data/friendsData';
import { getFeatureFlag } from '@/utils/featureFlags';
import SetupCoPlanModal from '@/components/coplan/SetupCoPlanModal';
import { X, Users, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const CoPlanInviteSetupPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [selectedPlanType, setSelectedPlanType] = useState<string | null>(null);

  const selectedFriends = location.state?.selectedFriends as Friend[] || [];
  const previousTab = location.state?.previousTab || 'active';
  const isPolishEnabled = getFeatureFlag('co_plan_polish_v2');

  const [localSelectedFriends, setLocalSelectedFriends] = useState(selectedFriends);

  useEffect(() => {
    if (!id) {
      setError('Invalid plan ID');
      return;
    }
  }, [id]);

  const handleBack = () => {
    navigate('/?initialTab=planner', { replace: true });
  };

  const handleRemoveFriend = (friend: Friend) => {
    setLocalSelectedFriends(prev => prev.filter(f => f.id !== friend.id));
  };

  const handleCreateDraft = ({ description, planType }: { description: string; planType: string | null }) => {
    if (!description.trim()) {
      return;
    }

    const coPlanService = CoPlanService.getInstance();
    const draft = coPlanService.createDraft(localSelectedFriends);
    
    // Update draft with setup data
    coPlanService.updateDraft(draft.id, {
      description: description.trim(),
      planType: planType,
      title: planType ? planType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Untitled Plan'
    });

    navigate(`/planner/draft/${draft.id}`, {
      state: { previousTab }
    });
  };

  if (localSelectedFriends.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No friends selected for co-planning</p>
          <Button onClick={handleBack}>
            Return to Planner
          </Button>
        </div>
      </div>
    );
  }

  if (isPolishEnabled) {
    return (
      <SetupCoPlanModal
        selectedFriends={localSelectedFriends}
        onRemoveFriend={handleRemoveFriend}
        onCreateDraft={handleCreateDraft}
        onBack={handleBack}
      />
    );
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

  const handleCreateDraftFallback = () => {
    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please add a description for your co-plan",
        variant: "destructive"
      });
      return;
    }

    const coPlanService = CoPlanService.getInstance();
    const draft = coPlanService.createDraft(selectedFriends);
    
    // Update draft with setup data
    coPlanService.updateDraft(draft.id, {
      description: description.trim(),
      planType: selectedPlanType,
      title: selectedPlanType ? planTypes.find(pt => pt.id === selectedPlanType)?.label || 'Untitled Plan' : 'Untitled Plan'
    });

    toast({
      title: "Co-Plan Created!",
      description: "Your collaborative plan is ready for editing",
      duration: 2000
    });

    navigate(`/planner/draft/${draft.id}`, {
      state: { previousTab }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="w-10" />
          <h1 className="font-semibold">Setup Co-Plan</h1>
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <X size={20} />
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
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
                <div key={friend.id} className="flex items-center space-x-2 bg-muted rounded-lg p-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{friend.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{friend.name}</span>
                </div>
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
                className="min-h-24"
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
              <div className="grid grid-cols-2 gap-2">
                {planTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedPlanType === type.id ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => setSelectedPlanType(type.id)}
                  >
                    <span className="mr-2">{type.emoji}</span>
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Button */}
        <Button 
          onClick={handleCreateDraftFallback}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          <Send size={18} className="mr-2" />
          Create Co-Plan
        </Button>
      </div>
    </div>
  );
};

export default CoPlanInviteSetupPage;
