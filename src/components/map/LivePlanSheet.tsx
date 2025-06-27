
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plan } from '@/data/plansData';
import { PlanProgressState } from '@/services/PlanStateService';
import { usePlanFriendTracking } from '@/hooks/usePlanFriendTracking';
import { useUserStatusTracking } from '@/hooks/useUserStatusTracking';
import PlanTab from './live-plan/PlanTab';
import MapTab from './live-plan/MapTab';
import ChatTab from './live-plan/ChatTab';
import PlanHeaderSummary from '../plan/PlanHeaderSummary';

interface LivePlanSheetProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  progressState: PlanProgressState;
  currentStopIndex: number;
  onPingGroup: () => void;
  onLeaveVenue: () => void;
  onCheckIn: () => void;
  onMessageFriends: () => void;
  onNavigateToVenue: (stopId: number) => void;
  onMoveToNext: () => void;
}

const LivePlanSheet = ({
  isOpen,
  onClose,
  plan,
  progressState,
  currentStopIndex,
  onPingGroup,
  onLeaveVenue,
  onCheckIn,
  onMessageFriends,
  onNavigateToVenue,
  onMoveToNext
}: LivePlanSheetProps) => {
  const [activeTab, setActiveTab] = useState('plan');
  const { friendTracking, getFriendStatusSummary } = usePlanFriendTracking(plan);
  const { userStatus, updateUserStatus } = useUserStatusTracking(plan);

  if (!plan) return null;

  const friendStatusSummary = getFriendStatusSummary();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] flex flex-col p-0"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          overscrollBehavior: 'contain'
        }}
      >
        <SheetHeader className="flex-shrink-0 px-4 pt-4 pb-2">
          <SheetTitle>
            <PlanHeaderSummary 
              plan={plan}
              friendStatusSummary={friendStatusSummary}
              friendTracking={friendTracking}
            />
          </SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 mx-4 mb-2">
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0">
            <TabsContent value="plan" className="h-full mt-0">
              <PlanTab
                plan={plan}
                progressState={progressState}
                currentStopIndex={currentStopIndex}
                friendTracking={friendTracking}
                userStatus={userStatus}
                updateUserStatus={updateUserStatus}
                onCheckIn={onCheckIn}
                onMoveToNext={onMoveToNext}
                onPingGroup={onPingGroup}
                onLeaveVenue={onLeaveVenue}
              />
            </TabsContent>

            <TabsContent value="map" className="h-full mt-0">
              <MapTab
                plan={plan}
                currentStopIndex={currentStopIndex}
                friendTracking={friendTracking}
                onNavigateToVenue={onNavigateToVenue}
              />
            </TabsContent>

            <TabsContent value="chat" className="h-full mt-0">
              <ChatTab
                plan={plan}
                onCheckIn={onCheckIn}
                onPingGroup={onPingGroup}
                onMessageFriends={onMessageFriends}
              />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default LivePlanSheet;
