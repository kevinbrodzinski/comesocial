
import React from 'react';
import { Users, ThumbsUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DraftVote } from '@/types/liveDraftTypes';

interface VotingBannerProps {
  vote: DraftVote;
  currentUserId: number;
  hasVoted: boolean;
  onVote: (voteId: string) => void;
  onDismiss: (voteId: string) => void;
}

const VotingBanner = ({ vote, currentUserId, hasVoted, onVote, onDismiss }: VotingBannerProps) => {
  const isProposer = vote.proposed_by === currentUserId;
  const voteCount = vote.votes.length;
  const needsVotes = vote.total_participants;

  return (
    <Card className="mb-4 bg-blue-50 border-blue-200">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Users size={14} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Suggestion</span>
              <Badge variant="secondary" className="text-xs">
                {voteCount}/{needsVotes} votes
              </Badge>
            </div>
            <p className="text-sm text-blue-700">{vote.description}</p>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {!hasVoted && !isProposer && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onVote(vote.id)}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <ThumbsUp size={14} className="mr-1" />
                Vote
              </Button>
            )}
            
            {(isProposer || hasVoted) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDismiss(vote.id)}
                className="text-blue-600 hover:bg-blue-100"
              >
                <X size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VotingBanner;
