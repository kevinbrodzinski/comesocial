
import React, { useState } from 'react';
import { X, UserX, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FriendRequestActionsProps {
  requestId: string;
  friendName: string;
  requestType: 'incoming' | 'outgoing';
  onCancel?: (requestId: string) => void;
  onWithdraw?: (requestId: string) => void;
}

const FriendRequestActions = ({ 
  requestId, 
  friendName, 
  requestType,
  onCancel, 
  onWithdraw 
}: FriendRequestActionsProps) => {
  const [cancelDialog, setCancelDialog] = useState(false);
  const { toast } = useToast();

  const handleCancelConfirm = () => {
    if (requestType === 'outgoing') {
      onWithdraw?.(requestId);
      toast({
        title: "Friend request withdrawn",
        description: `Withdrew friend request to ${friendName}`,
      });
    } else {
      onCancel?.(requestId);
      toast({
        title: "Friend request cancelled",
        description: `Cancelled friend request from ${friendName}`,
      });
    }
    setCancelDialog(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          <Clock size={10} className="mr-1" />
          {requestType === 'outgoing' ? 'Sent' : 'Received'}
        </Badge>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCancelDialog(true)}
          className="h-7 px-2 text-muted-foreground hover:text-red-600"
        >
          {requestType === 'outgoing' ? (
            <>
              <UserX size={12} className="mr-1" />
              Withdraw
            </>
          ) : (
            <>
              <X size={12} className="mr-1" />
              Decline
            </>
          )}
        </Button>
      </div>

      {/* Cancel/Withdraw Confirmation Dialog */}
      <AlertDialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {requestType === 'outgoing' ? 'Withdraw Friend Request?' : 'Decline Friend Request?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {requestType === 'outgoing' 
                ? `Are you sure you want to withdraw your friend request to ${friendName}? They won't be notified.`
                : `Are you sure you want to decline ${friendName}'s friend request? You can always accept it later if they send another one.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {requestType === 'outgoing' ? 'Withdraw' : 'Decline'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FriendRequestActions;
