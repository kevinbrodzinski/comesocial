
import React, { useState } from 'react';
import { Share2, Copy, MessageCircle, Instagram, Twitter, Facebook, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  planData: any;
  onTrackShare: (platform: string) => void;
}

const SocialShareModal = ({ isOpen, onClose, planData, onTrackShare }: SocialShareModalProps) => {
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();

  const generateShareText = (platform: string) => {
    const baseText = `Join me for "${planData.name}" on ${planData.date} at ${planData.time}! 🎉`;
    
    const platformTexts = {
      twitter: `${baseText} ${planData.stops.length} amazing stops planned! #NightOut #PlansWithFriends`,
      instagram: `${baseText}\n\n📍 ${planData.stops.slice(0, 2).join(' → ')}\n👥 ${planData.invitedFriends.length + 1} people going\n💰 ~$${planData.estimatedCost}/person`,
      facebook: `${baseText}\n\nWe're hitting up ${planData.stops.length} spots including ${planData.stops.slice(0, 2).join(' and ')}${planData.stops.length > 2 ? ' and more' : ''}!\n\nWho else wants to join? 🍻`,
      sms: `Hey! Want to join us for "${planData.name}" on ${planData.date} at ${planData.time}? We're going to ${planData.stops[0]}${planData.stops.length > 1 ? ` and ${planData.stops.length - 1} other spot${planData.stops.length > 2 ? 's' : ''}` : ''}. Let me know!`,
      default: baseText
    };

    return customMessage || platformTexts[platform] || platformTexts.default;
  };

  const shareTooltip = (platform: string) => {
    const shareText = generateShareText(platform);
    const encodedText = encodeURIComponent(shareText);
    const planUrl = `https://app.com/plan/${Date.now()}`; // Mock URL
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(planUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(planUrl)}&quote=${encodedText}`,
      instagram: '', // Instagram doesn't support direct URL sharing
      sms: `sms:?body=${encodedText}`,
      copy: shareText
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "Share text copied successfully"
      });
    } else if (platform === 'instagram') {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Text Copied",
        description: "Paste this in your Instagram story or post"
      });
    } else if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }

    onTrackShare(platform);
  };

  const generatePlanImage = () => {
    // This would generate a shareable image with plan details
    toast({
      title: "Image Generated",
      description: "Plan image ready for sharing"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 size={18} className="mr-2" />
            Share Your Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-1">{planData.name}</h4>
            <p className="text-sm text-muted-foreground">
              {planData.date} at {planData.time} • {planData.stops.length} stops • {planData.invitedFriends.length + 1} people
            </p>
          </div>

          <div>
            <Label htmlFor="customMessage">Custom Message (Optional)</Label>
            <Input
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add your own message..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>Share To</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => shareTooltip('twitter')}
                className="flex items-center justify-start p-3 h-auto"
              >
                <Twitter size={18} className="mr-3 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium text-sm">Twitter</div>
                  <div className="text-xs text-muted-foreground">Tweet your plan</div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => shareTooltip('instagram')}
                className="flex items-center justify-start p-3 h-auto"
              >
                <Instagram size={18} className="mr-3 text-purple-500" />
                <div className="text-left">
                  <div className="font-medium text-sm">Instagram</div>
                  <div className="text-xs text-muted-foreground">Story & post</div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => shareTooltip('facebook')}
                className="flex items-center justify-start p-3 h-auto"
              >
                <Facebook size={18} className="mr-3 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-sm">Facebook</div>
                  <div className="text-xs text-muted-foreground">Share with friends</div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => shareTooltip('sms')}
                className="flex items-center justify-start p-3 h-auto"
              >
                <MessageCircle size={18} className="mr-3 text-green-500" />
                <div className="text-left">
                  <div className="font-medium text-sm">Messages</div>
                  <div className="text-xs text-muted-foreground">Text friends</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => shareTooltip('copy')}
              className="w-full"
            >
              <Copy size={16} className="mr-2" />
              Copy Share Text
            </Button>
            
            <Button
              variant="outline"
              onClick={generatePlanImage}
              className="w-full"
            >
              <Instagram size={16} className="mr-2" />
              Generate Story Image
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Sharing helps others discover great spots and builds your social planning reputation
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareModal;
