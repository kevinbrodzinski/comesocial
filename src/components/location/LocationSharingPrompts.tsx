
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Eye, X } from 'lucide-react';

interface LocationSharingPromptProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'check-in' | 'plan-join' | 'map-open';
  onShare: (option: 'this-time' | 'always' | 'never') => void;
  venue?: string;
  planName?: string;
}

const LocationSharingPrompt = ({ 
  isOpen, 
  onClose, 
  type, 
  onShare, 
  venue, 
  planName 
}: LocationSharingPromptProps) => {
  if (!isOpen) return null;

  const getPromptContent = () => {
    switch (type) {
      case 'check-in':
        return {
          icon: <MapPin size={20} className="text-primary" />,
          title: "Share your location with friends?",
          description: venue 
            ? `Let your friends know you're at ${venue}`
            : "Let your friends know where you are",
          options: [
            { key: 'this-time', label: 'Share this time only', variant: 'default' as const },
            { key: 'always', label: 'Always share when I check in', variant: 'outline' as const },
            { key: 'never', label: "Don't share this time", variant: 'ghost' as const }
          ]
        };
      
      case 'plan-join':
        return {
          icon: <Users size={20} className="text-primary" />,
          title: "Share location with your group?",
          description: planName 
            ? `You're joining "${planName}". Want your group to see where you are?`
            : "You're joining a shared plan. Want your group to see where you are?",
          options: [
            { key: 'this-time', label: 'Yes, share with plan members', variant: 'default' as const },
            { key: 'always', label: 'Always share when joining plans', variant: 'outline' as const },
            { key: 'never', label: 'No, stay hidden', variant: 'ghost' as const }
          ]
        };
      
      case 'map-open':
        return {
          icon: <Eye size={20} className="text-primary" />,
          title: "Let friends know you're around?",
          description: "You're currently hidden. Want to let friends know you're here?",
          options: [
            { key: 'this-time', label: 'Share location', variant: 'default' as const },
            { key: 'always', label: 'Always share on map', variant: 'outline' as const },
            { key: 'never', label: 'Stay hidden', variant: 'ghost' as const }
          ]
        };
      
      default:
        return null;
    }
  };

  const content = getPromptContent();
  if (!content) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {content.icon}
                <CardTitle className="text-lg">{content.title}</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="w-8 h-8 p-0"
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{content.description}</p>
            
            <div className="space-y-2">
              {content.options.map((option) => (
                <Button
                  key={option.key}
                  variant={option.variant}
                  className="w-full justify-start"
                  onClick={() => {
                    onShare(option.key as 'this-time' | 'always' | 'never');
                    onClose();
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LocationSharingPrompt;
