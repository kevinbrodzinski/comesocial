
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Plan } from '@/data/plansData';
import FriendStatusList from './FriendStatusList';

interface PlanHeaderSummaryProps {
  plan: Plan;
  friendStatusSummary: {
    checkedIn: number;
    onTheWay: number;
    noResponse: number;
    leftEarly: number;
  };
  friendTracking: any;
}

const PlanHeaderSummary = ({ plan, friendStatusSummary, friendTracking }: PlanHeaderSummaryProps) => {
  const [showFullRoster, setShowFullRoster] = useState(false);

  const totalFriends = plan.attendees - 1; // Exclude current user
  const { checkedIn, onTheWay, noResponse, leftEarly } = friendStatusSummary;

  if (!friendTracking) {
    return (
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{plan.name}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users size={16} className="mr-1" />
          {plan.attendees} friends
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{plan.name}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFullRoster(!showFullRoster)}
          className="flex items-center space-x-1"
        >
          <Users size={16} />
          <span>{totalFriends} Friends</span>
          {showFullRoster ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-wrap">
          {checkedIn > 0 && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              🟢 {checkedIn} Checked-in
            </Badge>
          )}
          {onTheWay > 0 && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              ⏱️ {onTheWay} On the Way
            </Badge>
          )}
          {noResponse > 0 && (
            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
              💤 {noResponse} Quiet
            </Badge>
          )}
          {leftEarly > 0 && (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
              ⛔️ {leftEarly} Left Early
            </Badge>
          )}
        </div>
      </div>

      {showFullRoster && friendTracking && (
        <div className="mt-4 p-3 bg-muted/30 rounded-lg border">
          <h4 className="font-medium text-sm mb-3">Full Friend Roster</h4>
          <FriendStatusList
            friendsPresent={friendTracking.stopAttendance[0]?.friendsPresent || []}
            friendsEnRoute={friendTracking.stopAttendance[0]?.friendsEnRoute || []}
            friendsNoResponse={friendTracking.stopAttendance[0]?.friendsNoResponse || []}
            friendsLeftEarly={friendTracking.stopAttendance[0]?.friendsLeftEarly || []}
            friendStatuses={friendTracking.friendStatuses}
          />
        </div>
      )}
    </div>
  );
};

export default PlanHeaderSummary;
