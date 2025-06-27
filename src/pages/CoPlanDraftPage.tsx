import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUndoToast } from '@/components/toast/UndoToast';
import { useLiveDraftState } from '@/hooks/useLiveDraftState';
import CoPlanService from '@/services/CoPlanService';
import DraftActionsService from '@/services/draftActions';
import { PlannerDraft } from '@/types/coPlanTypes';
import { getFeatureFlag } from '@/utils/featureFlags';
import { usePlannerState } from '@/hooks/usePlannerState';
import { getPlanRole, PlanRole } from '@/utils/getPlanRole';
import { testUsers } from '@/data/sampleData';
import { useAuth } from '@/contexts/AuthContext';

// Components
import PlanDraftHeader from '@/components/coplan/live-draft/PlanDraftHeader';
import PresenceStrip from '@/components/coplan/live-draft/PresenceStrip';
import InfoBanner from '@/components/coplan/live-draft/InfoBanner';
import VotingBanner from '@/components/coplan/live-draft/VotingBanner';
import PlanDescriptionCard from '@/components/coplan/live-draft/PlanDescriptionCard';
import DraftStopCard from '@/components/coplan/live-draft/DraftStopCard';
import AddStopCard from '@/components/coplan/live-draft/AddStopCard';
import DraftEmptyHint from '@/components/coplan/live-draft/DraftEmptyHint';
import LockedSummary from '@/components/coplan/live-draft/LockedSummary';
import BottomActionBar from '@/components/coplan/live-draft/BottomActionBar';
import ChatDrawer from '@/components/coplan/live-draft/ChatDrawer';
import AddStopOptionsModal from '@/components/coplan/live-draft/AddStopOptionsModal';
import VenueSearchModal from '@/components/coplan/live-draft/VenueSearchModal';

const CoPlanDraftPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { showUndoToast } = useUndoToast();
  const { user } = useAuth();
  
  const [draft, setDraft] = useState<PlannerDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfoBanner, setShowInfoBanner] = useState(false); // Disabled notifications
  const [showAddStopOptions, setShowAddStopOptions] = useState(false);
  const [showVenueSearch, setShowVenueSearch] = useState(false);
  
  // Use the current authenticated user's ID, fallback to 1 for testing
  const currentUserId = user?.id ? parseInt(user.id.slice(-1)) || 1 : 1;

  const coPlanService = CoPlanService.getInstance();
  const draftActionsService = DraftActionsService.getInstance();
  const isPolishEnabled = getFeatureFlag('co_plan_polish_v2');
  const isRoleGuardEnabled = getFeatureFlag('plan_edit_role_guard_v1');

  // Get user role for this plan
  const userRole: PlanRole = draft ? getPlanRole(draft, currentUserId) : 'guest';

  const {
    draftState,
    updateStop,
    addCustomStop,
    addVenueStop,
    openVenueSearch,
    deleteStop,
    reorderStops,
    setEditingState,
    clearEditingState,
    toggleLock,
    toggleChat
  } = useLiveDraftState(id || '', currentUserId);

  const { handleGoLive } = usePlannerState();

  // Load draft data
  useEffect(() => {
    if (id) {
      const loadedDraft = coPlanService.getDraft(id);
      if (loadedDraft) {
        setDraft(loadedDraft);
      } else {
        toast({
          title: "Draft Not Found",
          description: "The requested draft could not be found",
          variant: "destructive"
        });
        navigate('/planner');
      }
      setIsLoading(false);
    }
  }, [id, navigate, toast]);

  const handleBack = () => {
    if (draft) {
      // Save any changes before leaving
      coPlanService.updateDraft(draft.id, {
        title: draft.title,
        description: draft.description,
        updated_at: new Date()
      });
    }

    const previousTab = location.state?.previousTab || 'active';
    navigate(`/?initialTab=${previousTab}`);
  };

  const handleSaveDraft = async () => {
    if (!draft) return;

    const savePayload = {
      title: draft.title,
      description: draft.description,
      stops: draftState.stops,
      // Add any other relevant state that should be persisted
    };

    const success = await draftActionsService.saveDraft(draft.id, savePayload);
    
    if (success) {
      // Show undo toast
      showUndoToast({
        message: "Draft saved",
        onUndo: () => {
          // Navigate back to draft (simple undo implementation)
          navigate(`/planner/draft/${draft.id}`, {
            state: { previousTab: 'drafts' }
          });
        },
        duration: 4000
      });

      // Navigate to main page with active tab (since drafts show in active tab)
      setTimeout(() => {
        navigate("/?initialTab=active", {
          state: { highlight: draft.id }
        });
      }, 500);
    } else {
      toast({
        title: "Save Failed",
        description: "Could not save the draft. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (draft) {
      const updatedDraft = coPlanService.updateDraft(draft.id, { title: newTitle });
      if (updatedDraft) {
        setDraft(updatedDraft);
      }
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    if (draft) {
      const updatedDraft = coPlanService.updateDraft(draft.id, { description: newDescription });
      if (updatedDraft) {
        setDraft(updatedDraft);
      }
    }
  };

  const handleAddStop = () => {
    setShowAddStopOptions(true);
  };

  const handleSuggestNearby = () => {
    setShowVenueSearch(true);
  };

  const handleSuggestStop = () => {
    // Pre-fill chat with suggestion message for guests
    toggleChat();
    // Note: In a real implementation, you might want to pre-fill the chat input
    // with "I'd like to suggest adding..." message
  };

  // No more voting banners - removing notifications
  const pendingVotes = []; // Empty array to remove all voting notifications

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading draft...</p>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Draft not found</p>
        </div>
      </div>
    );
  }

  const showReorderTip = draftState.stops.length < 2;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PlanDraftHeader
        title={draft?.title || ''}
        description={draft?.description || ''}
        isLocked={draftState.is_locked}
        canLock={draft?.host_id === currentUserId}
        hasStops={draftState.stops.length > 0}
        onBack={handleBack}
        onTitleChange={handleTitleChange}
        onDescriptionChange={isPolishEnabled ? handleDescriptionChange : undefined}
        onToggleLock={toggleLock}
      />

      {/* Presence Strip - Keep color indicators only */}
      {isPolishEnabled && (
        <PresenceStrip 
          presence={draftState.presence} 
          currentUserId={currentUserId} 
        />
      )}

      {/* Main Content */}
      <div className="pb-20">
        {draftState.is_locked ? (
          <LockedSummary 
            title={draft.title}
            date={new Date().toLocaleDateString()}
            stops={draftState.stops}
            participantCount={draftState.presence.length}
            isHost={draft.host_id === currentUserId}
            onGoLive={() => handleGoLive(draft.id)}
          />
        ) : (
          <div className="p-4 space-y-4">
            {/* Plan Description - Only show if polish is disabled */}
            {!isPolishEnabled && (
              <PlanDescriptionCard 
                title={draft.title}
                description={draft.description || ''}
                planType={draft.planType}
                onUpdate={(field, value) => {
                  if (field === 'description') {
                    const updatedDraft = coPlanService.updateDraft(draft.id, { description: value });
                    if (updatedDraft) {
                      setDraft(updatedDraft);
                    }
                  }
                }}
              />
            )}

            {/* Empty State or Stops */}
            {draftState.stops.length === 0 && isPolishEnabled ? (
              <DraftEmptyHint 
                onAddStop={handleAddStop}
                showReorderTip={showReorderTip}
              />
            ) : (
              <>
                {/* Stops */}
                {draftState.stops.map((stop, index) => (
                  <DraftStopCard
                    key={stop.id}
                    stop={stop}
                    isLocked={draftState.is_locked}
                    presence={draftState.presence}
                    currentUserId={currentUserId}
                    userRole={userRole}
                    onUpdate={(stopId, field, value) => updateStop(stopId, field, value)}
                    onDelete={deleteStop}
                    onEditStart={(stopId, field) => setEditingState(stopId, field)}
                    onEditEnd={clearEditingState}
                    onDragStart={(e, stopId) => {
                      e.dataTransfer.setData('text/plain', stopId);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e, targetStopId) => {
                      e.preventDefault();
                      const draggedStopId = e.dataTransfer.getData('text/plain');
                      reorderStops(draggedStopId, targetStopId);
                    }}
                  />
                ))}

                {/* Add Stop Card - Only show if polish is disabled */}
                {!isPolishEnabled && (
                  <AddStopCard 
                    onAddStopClick={handleAddStop}
                    isLocked={draftState.is_locked}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <BottomActionBar
        isLocked={draftState.is_locked}
        isChatOpen={draftState.chat_open}
        hasStops={draftState.stops.length > 0}
        onAddStopClick={handleAddStop}
        onSuggestNearby={handleSuggestNearby}
        onToggleChat={toggleChat}
        onToggleLock={toggleLock}
        onSaveDraft={handleSaveDraft}
        canLock={draft?.host_id === currentUserId}
        userRole={userRole}
        onSuggestStop={handleSuggestStop}
      />

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={draftState.chat_open}
        onClose={toggleChat}
        draftTitle={draft.title || 'Untitled Plan'}
        isLocked={draftState.is_locked}
        hasStops={draftState.stops.length > 0}
        onAddStop={handleAddStop}
        onToggleLock={toggleLock}
      />

      {/* Modals */}
      <AddStopOptionsModal
        isOpen={showAddStopOptions}
        onClose={() => setShowAddStopOptions(false)}
        onSearchVenues={() => {
          setShowAddStopOptions(false);
          setShowVenueSearch(true);
        }}
        onCreateCustom={() => {
          addCustomStop();
          setShowAddStopOptions(false);
        }}
      />

      <VenueSearchModal
        isOpen={showVenueSearch}
        onClose={() => setShowVenueSearch(false)}
        onSelectVenue={(venue) => {
          addVenueStop(venue);
          setShowVenueSearch(false);
        }}
      />
    </div>
  );
};

export default CoPlanDraftPage;
