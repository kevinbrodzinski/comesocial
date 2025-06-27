import React, { useState } from 'react';
import { Mail, Calendar, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import InvitationCard from './InvitationCard';
import { useInvitations } from '../../hooks/useInvitations';
import { PlanInvitation } from '../../services/InvitationService';

interface InvitationsTabContentProps {
  onViewPlan: (invitation: PlanInvitation) => void;
}

const InvitationsTabContent = ({ onViewPlan }: InvitationsTabContentProps) => {
  const { pendingInvitations, respondedInvitations, respondToInvitation } = useInvitations();
  const [activeTab, setActiveTab] = useState('pending');

  const handleBulkAction = (action: 'accept' | 'decline') => {
    pendingInvitations.forEach(invitation => {
      const response = action === 'accept' ? 'accepted' : 'declined';
      respondToInvitation(invitation.id, response);
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Going</Badge>;
      case 'declined':
        return <Badge variant="secondary">Declined</Badge>;
      case 'maybe':
        return <Badge variant="outline">Maybe</Badge>;
      default:
        return <Badge>Pending</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold">Invitations</h2>
        {pendingInvitations.length > 0 && (
          <div className="flex space-x-2">
            <Button
              onClick={() => handleBulkAction('accept')}
              size="sm"
              className="bg-green-600 hover:bg-green-700 h-9 flex-1 sm:flex-none"
            >
              Accept All
            </Button>
            <Button
              onClick={() => handleBulkAction('decline')}
              variant="outline"
              size="sm"
              className="h-9 flex-1 sm:flex-none"
            >
              Decline All
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10 sm:h-auto">
          <TabsTrigger value="pending" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3">
            <Mail size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Pending</span>
            <span className="sm:hidden">({pendingInvitations.length})</span>
            <span className="hidden sm:inline">({pendingInvitations.length})</span>
          </TabsTrigger>
          <TabsTrigger value="responded" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3">
            <Calendar size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Responded</span>
            <span className="sm:hidden">({respondedInvitations.length})</span>
            <span className="hidden sm:inline">({respondedInvitations.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pendingInvitations.length > 0 ? (
            <div className="space-y-4">
              {pendingInvitations
                .sort((a, b) => {
                  // Sort by urgency first, then by invitation time
                  const urgencyOrder = { high: 3, medium: 2, low: 1 };
                  if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
                    return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
                  }
                  return new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime();
                })
                .map((invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    onRespond={(response) => respondToInvitation(invitation.id, response)}
                    onViewPlan={() => onViewPlan(invitation)}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
              <Mail size={40} className="sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">No pending invitations</h3>
              <p className="text-sm sm:text-base text-muted-foreground px-4">When friends invite you to plans, they'll appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="responded" className="mt-4">
          {respondedInvitations.length > 0 ? (
            <div className="space-y-4">
              {respondedInvitations
                .sort((a, b) => new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime())
                .map((invitation) => (
                  <div key={invitation.id} className="border rounded-lg p-3 sm:p-4 bg-muted/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm sm:text-base">{invitation.planName}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Organized by {invitation.organizer} • {invitation.plan.date}
                        </p>
                      </div>
                      <div className="flex flex-col sm:text-right space-y-1">
                        {getStatusBadge(invitation.status)}
                        <p className="text-xs text-muted-foreground">
                          Responded {new Date(invitation.invitedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => onViewPlan(invitation)}
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-8 w-full sm:w-auto"
                    >
                      View Plan
                    </Button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
              <Calendar size={40} className="sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">No responded invitations</h3>
              <p className="text-sm sm:text-base text-muted-foreground px-4">Your invitation responses will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvitationsTabContent;
