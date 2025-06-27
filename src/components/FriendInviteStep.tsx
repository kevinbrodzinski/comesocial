
import React from 'react';
import { Users, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import GroupPresets from './GroupPresets';

interface FriendInviteStepProps {
  planData: any;
  allFriends: any[];
  onGroupPresetSelect: (group: any) => void;
  onFriendToggle: (friend: any) => void;
  onInputChange: (field: string, value: any) => void;
  onShowPaymentModal: () => void;
}

const FriendInviteStep = ({ 
  planData, 
  allFriends, 
  onGroupPresetSelect, 
  onFriendToggle,
  onInputChange,
  onShowPaymentModal
}: FriendInviteStepProps) => {
  return (
    <div className="space-y-4 animate-slide-in-right">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Invite Friends</h3>
        <Badge variant="secondary">
          {planData.invitedFriends.length} invited
        </Badge>
      </div>

      <GroupPresets onSelectGroup={onGroupPresetSelect} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allFriends.map((friend) => {
          const isInvited = planData.invitedFriends.some(f => f.id === friend.id);
          return (
            <div
              key={friend.id}
              onClick={() => onFriendToggle(friend)}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                isInvited 
                  ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={friend.avatarUrl} alt={friend.name} />
                    <AvatarFallback>{friend.avatar}</AvatarFallback>
                  </Avatar>
                  {friend.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {friend.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {planData.invitedFriends.length > 0 && (
        <Card className="animate-fade-in">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-muted-foreground" />
                <span className="text-sm">Split costs automatically?</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={planData.splitPayment}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onShowPaymentModal();
                    } else {
                      onInputChange('splitPayment', false);
                      onInputChange('paymentSetup', null);
                    }
                  }}
                />
                {planData.splitPayment && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShowPaymentModal}
                  >
                    <CreditCard size={14} className="mr-1" />
                    Setup
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FriendInviteStep;
