
import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import PostContextSelector from './post/PostContextSelector';
import PostTypeSelector from './post/PostTypeSelector';
import TimeSlotSelector from './post/TimeSlotSelector';
import InviteTypeSelector from './post/InviteTypeSelector';
import FriendTagger from './post/FriendTagger';
import PostFormFields from './post/PostFormFields';
import PlanAttachmentSelector from './post/PlanAttachmentSelector';
import PlanPreviewBadge from './post/PlanPreviewBadge';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (postData: any) => void;
  currentView?: 'discover' | 'blasts' | 'live';
  planData?: {
    venue?: string;
    timeSlot?: string;
    caption?: string;
    planId?: number;
    postType?: 'going-out' | 'rally' | 'looking-for';
  } | null;
}

const CreatePostModal = ({ isOpen, onClose, onCreatePost, currentView = 'discover', planData }: CreatePostModalProps) => {
  const isGoingOutMode = currentView === 'blasts';
  
  const [postData, setPostData] = useState({
    caption: '',
    venue: '',
    image: null as File | null,
    imagePreview: null as string | null,
    postType: 'going-out' as 'going-out' | 'rally' | 'looking-for',
    postContext: 'solo' as 'solo' | 'group' | 'plan',
    timeSlot: '',
    inviteType: 'friends-only' as 'open' | 'friends-only' | 'group',
    taggedFriends: [] as Array<{id: number, name: string, avatar: string}>,
    attachedPlan: null as {id: number, title: string, date: string, stops: number} | null,
    planId: null as number | null
  });
  const { toast } = useToast();

  // Mock data for friends and plans
  const mockFriends = [
    { id: 1, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    { id: 2, name: 'Mike', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { id: 3, name: 'Emma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    { id: 4, name: 'Alex', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }
  ];

  const mockPlans = [
    { id: 1, title: 'Downtown Bar Crawl', date: 'Tonight', stops: 4 },
    { id: 2, title: 'Rooftop Party Circuit', date: 'Tomorrow', stops: 3 },
    { id: 3, title: 'Live Music Night', date: 'This Weekend', stops: 2 }
  ];

  // Pre-fill form when planData is provided
  useEffect(() => {
    if (planData && isOpen) {
      setPostData(prev => ({
        ...prev,
        caption: planData.caption || '',
        venue: planData.venue || '',
        timeSlot: planData.timeSlot || '',
        postType: planData.postType || 'going-out',
        postContext: planData.planId ? 'plan' : 'solo',
        planId: planData.planId || null
      }));
    }
  }, [planData, isOpen]);

  // Smart behavior: Auto-switch context based on tagged friends
  useEffect(() => {
    if (postData.taggedFriends.length > 0 && postData.postContext === 'solo') {
      setPostData(prev => ({ ...prev, postContext: 'group' }));
    } else if (postData.taggedFriends.length === 0 && postData.postContext === 'group') {
      setPostData(prev => ({ ...prev, postContext: 'solo' }));
    }
  }, [postData.taggedFriends]);

  const handleInputChange = (field: string, value: any) => {
    setPostData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setPostData(prev => ({
      ...prev,
      image: file,
      imagePreview: imageUrl
    }));
  };

  const handleImageRemove = () => {
    if (postData.imagePreview) {
      URL.revokeObjectURL(postData.imagePreview);
    }
    setPostData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const handleCreatePlan = () => {
    // Trigger plan creation - this would open plan creation modal
    console.log('Create new plan triggered');
    toast({
      title: "Plan Creation",
      description: "Plan creation feature coming soon!",
    });
  };

  const handleCreatePost = () => {
    if (!postData.caption.trim()) {
      toast({
        title: isGoingOutMode ? "Message is empty" : "Post is empty",
        description: isGoingOutMode ? "Tell your friends what you're thinking!" : "Please add a caption or image to your post",
        variant: "destructive"
      });
      return;
    }

    if (isGoingOutMode) {
      // Create a blast with enhanced data
      const newBlast = {
        id: Date.now(),
        friend: 'You',
        friendAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        message: postData.caption,
        timePosted: 'Just now',
        location: postData.venue || undefined,
        responses: [],
        type: postData.postType,
        postContext: postData.postContext,
        timeSlot: postData.timeSlot,
        inviteType: postData.inviteType,
        taggedFriends: postData.taggedFriends,
        attachedPlan: postData.attachedPlan,
        rsvpList: [],
        maybeList: [],
        planId: postData.planId || postData.attachedPlan?.id
      };

      onCreatePost(newBlast);
      
      const toastMessage = postData.attachedPlan || postData.planId 
        ? "Plan blasted to your friends! 🔥" 
        : "Blast sent! 🔥";
      
      toast({
        title: toastMessage,
        description: "Your friends will see your invite",
      });
    } else {
      // Create a regular feed post
      const newPost = {
        id: Date.now(),
        caption: postData.caption,
        venue: postData.venue || 'Unknown Location',
        image: postData.imagePreview,
        timePosted: 'Just now',
        likes: 0,
        comments: 0,
        friend: 'You',
        friendAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        type: 'User Post',
        vibe: 'Casual',
        crowdLevel: Math.floor(Math.random() * 100),
        distance: '0.0 mi'
      };

      onCreatePost(newPost);
      
      toast({
        title: "Post created! 📸",
        description: "Your post has been added to the feed",
      });
    }
    
    // Clean up and reset
    if (postData.imagePreview) {
      URL.revokeObjectURL(postData.imagePreview);
    }
    
    setPostData({
      caption: '',
      venue: '',
      image: null,
      imagePreview: null,
      postType: 'going-out',
      postContext: 'solo',
      timeSlot: '',
      inviteType: 'friends-only',
      taggedFriends: [],
      attachedPlan: null,
      planId: null
    });

    onClose();
  };

  const handleClose = () => {
    if (postData.imagePreview) {
      URL.revokeObjectURL(postData.imagePreview);
    }
    setPostData({
      caption: '',
      venue: '',
      image: null,
      imagePreview: null,
      postType: 'going-out',
      postContext: 'solo',
      timeSlot: '',
      inviteType: 'friends-only',
      taggedFriends: [],
      attachedPlan: null,
      planId: null
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {isGoingOutMode ? (
              <>
                <Zap size={20} className="text-orange-600" />
                <span>{postData.attachedPlan || postData.planId ? 'Blast Your Plan' : "Who's Down?"}</span>
              </>
            ) : (
              <span>Create New Post</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <PlanPreviewBadge planId={postData.planId} />

          {isGoingOutMode && (
            <div className="space-y-4">
              {/* 1. Post Context */}
              <PostContextSelector
                postContext={postData.postContext}
                onPostContextChange={(context) => handleInputChange('postContext', context)}
              />

              {/* 2. Post Type */}
              <PostTypeSelector
                postType={postData.postType}
                onPostTypeChange={(type) => handleInputChange('postType', type)}
              />

              {/* 3. Time */}
              <TimeSlotSelector
                timeSlot={postData.timeSlot}
                onTimeSlotChange={(timeSlot) => handleInputChange('timeSlot', timeSlot)}
              />

              {/* 4. Visibility */}
              <InviteTypeSelector
                inviteType={postData.inviteType}
                onInviteTypeChange={(type) => handleInputChange('inviteType', type)}
              />

              {/* 5. Who's Involved */}
              {(postData.postContext === 'group' || postData.taggedFriends.length > 0) && (
                <FriendTagger
                  selectedFriends={postData.taggedFriends}
                  onFriendsChange={(friends) => handleInputChange('taggedFriends', friends)}
                  availableFriends={mockFriends}
                />
              )}

              {/* 6. Plan Attachment */}
              {postData.postContext === 'plan' && (
                <PlanAttachmentSelector
                  selectedPlan={postData.attachedPlan}
                  onPlanSelect={(plan) => handleInputChange('attachedPlan', plan)}
                  availablePlans={mockPlans}
                  onCreatePlan={handleCreatePlan}
                />
              )}
            </div>
          )}

          {/* 7. Main Content (Vibe + Location) */}
          <PostFormFields
            caption={postData.caption}
            venue={postData.venue}
            image={postData.image}
            imagePreview={postData.imagePreview}
            isGoingOutMode={isGoingOutMode}
            onCaptionChange={(caption) => handleInputChange('caption', caption)}
            onVenueChange={(venue) => handleInputChange('venue', venue)}
            onImageSelect={handleImageSelect}
            onImageRemove={handleImageRemove}
          />

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePost} 
              className={`flex-1 ${isGoingOutMode ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
            >
              {isGoingOutMode ? (postData.attachedPlan || postData.planId ? 'Blast Plan' : 'Send Blast') : 'Share Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
