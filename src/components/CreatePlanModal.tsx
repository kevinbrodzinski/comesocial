
import React from 'react';
import { X, BarChart3, Share2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MapPickerModal from './MapPickerModal';
import VenueBrowserModal from './VenueBrowserModal';
import CreateCustomVenueModal from './CreateCustomVenueModal';
import PaymentSplitModal from './PaymentSplitModal';
import PlanAnalytics from './PlanAnalytics';
import SocialShareModal from './SocialShareModal';
import NotificationCenter from './NotificationCenter';
import NotificationSettings from './settings/NotificationSettings';
import PlanDetailsStep from './PlanDetailsStep';
import RouteBuilderStep from './RouteBuilderStep';
import FriendInviteStep from './FriendInviteStep';
import PlanReviewStep from './PlanReviewStep';
import PlanTemplates from './plan/PlanTemplates';
import { usePlanFormLogic } from '@/hooks/usePlanFormLogic';
import { usePlanHandlers } from '@/hooks/usePlanHandlers';
import { usePlanModals } from '@/hooks/usePlanModals';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (planData: any) => void;
  editingPlan?: any;
}

const CreatePlanModal = ({ isOpen, onClose, onCreatePlan, editingPlan }: CreatePlanModalProps) => {
  const {
    planData,
    step,
    dateValidation,
    draggedIndex,
    setDraggedIndex,
    handleInputChange,
    nextStep,
    prevStep,
    getStepTitle,
    canProceedToNext,
    trackPlanEvent
  } = usePlanFormLogic(editingPlan, isOpen);

  const {
    showMapPicker,
    setShowMapPicker,
    showVenueBrowser,
    setShowVenueBrowser,
    showCustomVenueModal,
    setShowCustomVenueModal,
    showPaymentModal,
    setShowPaymentModal,
    showAnalytics,
    setShowAnalytics,
    showSocialShare,
    setShowSocialShare,
    showNotificationCenter,
    setShowNotificationCenter,
    showNotificationSettings,
    setShowNotificationSettings
  } = usePlanModals();

  const {
    handleLocationSelect,
    handleVenueSelect,
    handleCustomVenueCreate,
    handleFriendToggle,
    handleStopRemove,
    handleGroupPresetSelect,
    handlePaymentSetup,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleSendNotification,
    handleTrackShare,
    handleCreatePlan
  } = usePlanHandlers(
    planData,
    handleInputChange,
    setDraggedIndex,
    draggedIndex,
    trackPlanEvent,
    step
  );

  const allFriends = [
    { id: 1, name: 'Alex Martinez', avatar: 'AM', isOnline: true },
    { id: 2, name: 'Sarah Chen', avatar: 'SC', isOnline: false },
    { id: 3, name: 'Mike Johnson', avatar: 'MJ', isOnline: true },
    { id: 4, name: 'Emma Wilson', avatar: 'EW', isOnline: true },
    { id: 5, name: 'Jordan Lee', avatar: 'JL', isOnline: false }
  ];

  // Handle template selection
  const handleTemplateSelect = (template: any) => {
    handleInputChange('name', template.name);
    handleInputChange('estimatedDuration', parseInt(template.duration.split('-')[0]));
    
    // Convert template stops to venue format
    const templateStops = template.stops.map((stop: string, index: number) => ({
      id: Date.now() + index,
      name: stop,
      type: 'venue',
      estimatedTime: 90,
      cost: 25
    }));
    
    handleInputChange('stops', templateStops);
    trackPlanEvent('template_selected', { template_id: template.id });
  };

  // Check if this is a quick plan (single venue with AI suggestions)
  const isQuickPlan = editingPlan?.isQuickPlan || false;
  const isNewPlan = !editingPlan?.id;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <PlanDetailsStep
            planData={planData}
            onInputChange={handleInputChange}
            onShowMapPicker={() => setShowMapPicker(true)}
            dateValidation={dateValidation}
          />
        );
      case 2:
        return (
          <RouteBuilderStep
            planData={planData}
            onShowVenueBrowser={() => setShowVenueBrowser(true)}
            onShowCustomVenueModal={() => setShowCustomVenueModal(true)}
            onStopRemove={handleStopRemove}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        );
      case 3:
        return (
          <FriendInviteStep
            planData={planData}
            allFriends={allFriends}
            onGroupPresetSelect={handleGroupPresetSelect}
            onFriendToggle={handleFriendToggle}
            onInputChange={handleInputChange}
            onShowPaymentModal={() => setShowPaymentModal(true)}
          />
        );
      case 4:
        return <PlanReviewStep planData={planData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <span>{getStepTitle()}</span>
              {!isQuickPlan && (
                <Badge variant="outline" className="animate-fade-in">
                  Step {step} of 4
                </Badge>
              )}
              {isQuickPlan && (
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Quick Plan
                </Badge>
              )}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotificationSettings(true)}
                className="hover-scale"
              >
                <Settings size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalytics(true)}
                className="hover-scale"
              >
                <BarChart3 size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSocialShare(true)}
                className="hover-scale"
              >
                <Share2 size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 animate-fade-in">
            {/* Show templates only for new plans */}
            {isNewPlan && step === 1 && !planData.name && (
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="templates">Quick Start</TabsTrigger>
                  <TabsTrigger value="custom">Custom Plan</TabsTrigger>
                </TabsList>
                <TabsContent value="templates">
                  <PlanTemplates onSelectTemplate={handleTemplateSelect} />
                </TabsContent>
                <TabsContent value="custom">
                  {renderStepContent()}
                </TabsContent>
              </Tabs>
            )}

            {/* Regular step content */}
            {(planData.name || step > 1 || editingPlan?.id) && (
              <>
                {/* Progress bar - hide for quick plans */}
                {!isQuickPlan && (
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(step / 4) * 100}%` }}
                    />
                  </div>
                )}

                {renderStepContent()}

                {/* Navigation */}
                <div className="flex justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                  >
                    Previous
                  </Button>
                  
                  {step < 4 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceedToNext()}
                    >
                      {isQuickPlan && step === 2 ? 'Skip to Review' : 'Next'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleCreatePlan(editingPlan, onCreatePlan, onClose)}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    >
                      {editingPlan?.id ? 'Update Plan' : 'Create Plan'}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <MapPickerModal
        isOpen={showMapPicker}
        onClose={() => {
          setShowMapPicker(false);
        }}
        onLocationSelect={(location) => {
          handleLocationSelect(location);
          setShowMapPicker(false);
        }}
        currentLocation={planData.meetupLocation}
      />

      <VenueBrowserModal
        open={showVenueBrowser}
        onOpenChange={setShowVenueBrowser}
        onVenueSelect={(venue) => {
          handleVenueSelect(venue);
          setShowVenueBrowser(false);
        }}
      />

      <CreateCustomVenueModal
        isOpen={showCustomVenueModal}
        onClose={() => setShowCustomVenueModal(false)}
        onCreateVenue={(venue) => {
          handleCustomVenueCreate(venue);
          setShowCustomVenueModal(false);
        }}
      />

      <PaymentSplitModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalCost={planData.estimatedCost}
        attendees={planData.invitedFriends}
        planName={planData.name}
        onSetupPayment={(paymentData) => {
          handlePaymentSetup(paymentData);
          setShowPaymentModal(false);
        }}
      />

      {showAnalytics && (
        <PlanAnalytics
          planData={planData}
          onTrackEvent={trackPlanEvent}
        />
      )}

      <SocialShareModal
        isOpen={showSocialShare}
        onClose={() => setShowSocialShare(false)}
        planData={planData}
        onTrackShare={handleTrackShare}
      />

      <NotificationSettings
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />

      {showNotificationCenter && (
        <NotificationCenter
          planData={planData}
          onSendNotification={handleSendNotification}
        />
      )}
    </>
  );
};

export default CreatePlanModal;
