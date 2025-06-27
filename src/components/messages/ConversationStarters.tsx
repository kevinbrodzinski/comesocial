
import React from 'react';
import { Send, MapPin, Zap, Coffee, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversationStartersProps {
  friend: any;
  onQuickReply: (text: string) => void;
}

const ConversationStarters = ({ friend, onQuickReply }: ConversationStartersProps) => {
  const getConversationStarters = () => {
    const starters = [];
    
    if (friend.location) {
      starters.push({
        icon: <MapPin size={14} />,
        text: `How's ${friend.location}?`,
        category: 'location'
      });
    }
    
    if (friend.plan) {
      starters.push({
        icon: <Zap size={14} />,
        text: `Can I join ${friend.plan}?`,
        category: 'plan'
      });
    }

    starters.push(
      {
        icon: <Coffee size={14} />,
        text: "What's the vibe like?",
        category: 'general'
      },
      {
        icon: <Clock size={14} />,
        text: "Free later tonight?",
        category: 'hangout'
      }
    );

    return starters;
  };

  const conversationStarters = getConversationStarters();

  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
        <Send size={20} className="text-primary" />
      </div>
      <p className="text-muted-foreground text-sm mb-4">
        Start a conversation with {friend.name.split(' ')[0]}
      </p>
      
      {/* Conversation Starters */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Quick starters:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {conversationStarters.map((starter, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-7 hover:scale-105 transition-transform"
              onClick={() => onQuickReply(starter.text)}
            >
              {starter.icon}
              <span className="ml-1">{starter.text}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationStarters;
