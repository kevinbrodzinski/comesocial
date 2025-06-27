
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, CheckCircle, MapPin, Users, MessageCircle } from 'lucide-react';
import { Plan } from '@/data/plansData';
import { friendsData } from '@/data/friendsData';

interface ChatTabProps {
  plan: Plan;
  onCheckIn: () => void;
  onPingGroup: () => void;
  onMessageFriends: () => void;
}

interface ChatMessage {
  id: string;
  type: 'message' | 'check-in' | 'vote' | 'suggestion';
  user: string;
  content: string;
  timestamp: Date;
  venue?: string;
  voteCount?: number;
  totalVotes?: number;
}

const ChatTab = ({
  plan,
  onCheckIn,
  onPingGroup,
  onMessageFriends
}: ChatTabProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'check-in',
      user: 'Sarah',
      content: 'checked in',
      timestamp: new Date(Date.now() - 300000), // 5 min ago
      venue: 'Sky Bar'
    },
    {
      id: '2',
      type: 'message',
      user: 'Mike',
      content: 'This place is amazing! Great vibes 🎉',
      timestamp: new Date(Date.now() - 240000) // 4 min ago
    },
    {
      id: '3',
      type: 'vote',
      user: 'Emily',
      content: 'suggested moving to the next spot',
      timestamp: new Date(Date.now() - 120000), // 2 min ago
      voteCount: 3,
      totalVotes: 5
    },
    {
      id: '4',
      type: 'message',
      user: 'Alex',
      content: 'I vote yes! Ready for dancing 💃',
      timestamp: new Date(Date.now() - 60000) // 1 min ago
    }
  ]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'message',
      user: 'You',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleQuickAction = (action: string) => {
    let actionMessage: ChatMessage;

    switch (action) {
      case 'check-in':
        onCheckIn();
        actionMessage = {
          id: Date.now().toString(),
          type: 'check-in',
          user: 'You',
          content: 'checked in',
          timestamp: new Date(),
          venue: plan.stops[0].name // Using first stop as current
        };
        break;
      case 'suggest-stop':
        actionMessage = {
          id: Date.now().toString(),
          type: 'suggestion',
          user: 'You',
          content: 'suggested a new stop',
          timestamp: new Date()
        };
        break;
      case 'vote-leave':
        actionMessage = {
          id: Date.now().toString(),
          type: 'vote',
          user: 'You',
          content: 'voted to leave for the next spot',
          timestamp: new Date(),
          voteCount: 4,
          totalVotes: 5
        };
        break;
      case 'ping':
        onPingGroup();
        actionMessage = {
          id: Date.now().toString(),
          type: 'message',
          user: 'You',
          content: '📍 Where is everyone?',
          timestamp: new Date()
        };
        break;
      default:
        return;
    }

    setMessages(prev => [...prev, actionMessage]);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.user === 'You';

    switch (msg.type) {
      case 'check-in':
        return (
          <div className="flex items-center space-x-2 py-2">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-sm">
              <span className="font-medium">{msg.user}</span> {msg.content}
              {msg.venue && <span className="text-muted-foreground"> at {msg.venue}</span>}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">{formatTime(msg.timestamp)}</span>
          </div>
        );

      case 'vote':
        return (
          <div className="py-2">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Users size={16} className="text-blue-600" />
                <span className="text-sm font-medium">{msg.user}</span>
                <span className="text-sm">{msg.content}</span>
              </div>
              {msg.voteCount && msg.totalVotes && (
                <Badge className="bg-blue-100 text-blue-800">
                  {msg.voteCount} of {msg.totalVotes} voted
                </Badge>
              )}
              <span className="text-xs text-muted-foreground block mt-1">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        );

      case 'suggestion':
        return (
          <div className="py-2">
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-purple-600" />
                <span className="text-sm">
                  <span className="font-medium">{msg.user}</span> {msg.content}
                </span>
              </div>
              <span className="text-xs text-muted-foreground block mt-1">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        );

      default:
        return (
          <div className={`py-2 ${isUser ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-[80%] ${
              isUser 
                ? 'bg-primary text-primary-foreground rounded-l-lg rounded-tr-lg' 
                : 'bg-muted rounded-r-lg rounded-tl-lg'
            } px-3 py-2`}>
              {!isUser && <div className="text-xs font-medium mb-1">{msg.user}</div>}
              <div className="text-sm">{msg.content}</div>
              <div className={`text-xs mt-1 ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 min-h-0">
        <ScrollArea 
          ref={scrollAreaRef}
          className="h-full"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="px-4 py-2 space-y-1">
            {messages.map(renderMessage)}
          </div>
        </ScrollArea>
      </div>

      {/* Quick Actions */}
      <div className="flex-shrink-0 p-4 border-t bg-background">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleQuickAction('check-in')}
          >
            <CheckCircle size={14} className="mr-1" />
            Check In
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleQuickAction('suggest-stop')}
          >
            <MapPin size={14} className="mr-1" />
            Suggest Stop
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleQuickAction('vote-leave')}
          >
            <Users size={14} className="mr-1" />
            Vote to Leave
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleQuickAction('ping')}
          >
            <MessageCircle size={14} className="mr-1" />
            Ping Group
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;
