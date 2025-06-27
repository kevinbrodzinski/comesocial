
import React, { useState } from 'react';
import { MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import BlastRSVPModal from './BlastRSVPModal';

interface BlastCardProps {
  blast: {
    id: number;
    friend: string;
    friendAvatar: string;
    message: string;
    timePosted: string;
    location?: string;
    responses: string[];
    type: 'going-out' | 'rally' | 'looking-for';
    timeSlot?: string;
    inviteType?: 'open' | 'friends-only' | 'group';
    rsvpList: string[];
    maybeList: string[];
  };
  onResponse: (blastId: number, response: 'join' | 'maybe') => void;
}

const BlastCard = ({ blast, onResponse }: BlastCardProps) => {
  const [showRSVPModal, setShowRSVPModal] = useState(false);

  const getBlastTypeStyle = (type: string) => {
    switch (type) {
      case 'rally':
        return 'border-l-4 border-l-red-500 bg-card/80 backdrop-blur-sm';
      case 'going-out':
        return 'border-l-4 border-l-orange-500 bg-card/80 backdrop-blur-sm';
      default:
        return 'border-l-4 border-l-blue-500 bg-card/80 backdrop-blur-sm';
    }
  };

  const getBlastTypeLabel = (type: string) => {
    switch (type) {
      case 'rally':
        return '🔥 Rally';
      case 'going-out':
        return '🍻 Going Out';
      default:
        return '💭 Looking For';
    }
  };

  const getBlastTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'rally':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
      case 'going-out':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
    }
  };

  const totalResponses = blast.rsvpList.length + blast.maybeList.length;
  const isUserGoing = blast.rsvpList.includes('You');
  const isUserMaybe = blast.maybeList.includes('You');

  const getMomentumMessage = () => {
    const goingCount = blast.rsvpList.length;
    if (goingCount >= 8) {
      return "🔥 This is getting hot! ";
    } else if (goingCount >= 5) {
      return "⚡ Building momentum! ";
    } else if (goingCount >= 3) {
      return "🎯 Good turnout! ";
    }
    return "";
  };

  return (
    <>
      <div className={`rounded-xl p-4 shadow-sm border ${getBlastTypeStyle(blast.type)} hover:shadow-md transition-all`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={blast.friendAvatar} alt={blast.friend} />
              <AvatarFallback>{blast.friend[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground">{blast.friend}</h3>
                <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getBlastTypeBadgeStyle(blast.type)}`}>
                  {getBlastTypeLabel(blast.type)}
                </Badge>
              </div>
              {blast.timeSlot && (
                <div className="flex items-center text-xs text-muted-foreground mt-1 font-semibold">
                  <Clock size={12} className="mr-1" />
                  <span>{blast.timeSlot}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock size={12} className="mr-1" />
            <span>{blast.timePosted}</span>
          </div>
        </div>

        {/* Message */}
        <div className="mb-4">
          <p className="text-foreground font-medium leading-relaxed">
            {blast.message}
          </p>
          {blast.location && (
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <MapPin size={14} className="mr-1" />
              <span>{blast.location}</span>
            </div>
          )}
        </div>

        {/* Momentum Alert */}
        {getMomentumMessage() && (
          <div className="mb-4 p-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
              {getMomentumMessage()}
              {blast.rsvpList.length} friends are down!
            </p>
          </div>
        )}

        {/* Social Proof - Enhanced with click functionality */}
        {totalResponses > 0 && (
          <button
            onClick={() => setShowRSVPModal(true)}
            className="flex items-center text-sm text-muted-foreground mb-4 hover:text-primary transition-colors cursor-pointer"
          >
            <Users size={14} className="mr-1" />
            <span>
              {blast.rsvpList.length > 0 && (
                <>
                  {blast.rsvpList.slice(0, 2).join(', ')}
                  {blast.rsvpList.length > 2 && ` + ${blast.rsvpList.length - 2} others`}
                  {blast.rsvpList.length === 1 ? ' is going' : ' are going'}
                </>
              )}
              {blast.rsvpList.length > 0 && blast.maybeList.length > 0 && ', '}
              {blast.maybeList.length > 0 && (
                <>
                  {blast.maybeList.length} maybe
                </>
              )}
            </span>
            <span className="ml-1 text-xs">• Click to see all</span>
          </button>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => onResponse(blast.id, 'join')}
            className={`flex-1 font-medium transition-all ${
              isUserGoing 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {isUserGoing ? "You're Going! ✓" : "I'm Down! 🙌"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onResponse(blast.id, 'maybe')}
            className={`flex-1 transition-all ${
              isUserMaybe 
                ? 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200' 
                : 'hover:bg-muted border-border'
            }`}
          >
            {isUserMaybe ? "Maybe ✓" : "Maybe 🤔"}
          </Button>
        </div>
      </div>

      <BlastRSVPModal 
        isOpen={showRSVPModal}
        onClose={() => setShowRSVPModal(false)}
        blast={blast}
      />
    </>
  );
};

export default BlastCard;
