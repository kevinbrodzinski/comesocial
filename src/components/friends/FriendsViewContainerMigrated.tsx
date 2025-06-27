import React, { useState, useCallback } from 'react';
import FriendsViewProvider from './FriendsViewProvider';
import FriendsViewProviderMigrated from './FriendsViewProviderMigrated';
import FriendsViewPresentation from './FriendsViewPresentation';
import { useFriendsActionModals } from '@/hooks/useFriendsActionModals';
import { shouldUseMigratedComponent, MIGRATION_FLAGS } from '@/utils/migrationFlags';

const FriendsViewContainerMigrated = () => {
  const [createPlanModal, setCreatePlanModal] = useState(false);
  const [userDiscoveryModal, setUserDiscoveryModal] = useState(false);
  const actionModals = useFriendsActionModals();

  const handleMessagesNavigation = useCallback(() => {
    const event = new CustomEvent('switchTab', { detail: { tab: 'messages' } });
    window.dispatchEvent(event);
  }, []);

  const handleCreatePlanClose = useCallback(() => {
    setCreatePlanModal(false);
  }, []);

  const handleCreatePlanOpen = useCallback(() => {
    setCreatePlanModal(true);
  }, []);

  const handleCreatePlan = useCallback((planData: any) => {
    console.log('Plan created:', planData);
    setCreatePlanModal(false);
  }, []);

  // Check if we should use the migrated version
  const useMigratedVersion = shouldUseMigratedComponent(MIGRATION_FLAGS.FRIENDS_VIEW_MIGRATED);

  return (
    <>
      {useMigratedVersion ? (
        <FriendsViewProviderMigrated>
          {(props) => (
            <FriendsViewPresentation
              {...props}
              actionModals={actionModals}
              userDiscoveryModal={userDiscoveryModal}
              setUserDiscoveryModal={setUserDiscoveryModal}
              createPlanModal={createPlanModal}
              handleCreatePlanClose={handleCreatePlanClose}
              handleCreatePlanOpen={handleCreatePlanOpen}
              handleCreatePlan={handleCreatePlan}
              handleMessagesNavigation={handleMessagesNavigation}
            />
          )}
        </FriendsViewProviderMigrated>
      ) : (
        <FriendsViewProvider>
          {(props) => (
            <FriendsViewPresentation
              {...props}
              actionModals={actionModals}
              userDiscoveryModal={userDiscoveryModal}
              setUserDiscoveryModal={setUserDiscoveryModal}
              createPlanModal={createPlanModal}
              handleCreatePlanClose={handleCreatePlanClose}
              handleCreatePlanOpen={handleCreatePlanOpen}
              handleCreatePlan={handleCreatePlan}
              handleMessagesNavigation={handleMessagesNavigation}
            />
          )}
        </FriendsViewProvider>
      )}
    </>
  );
};

export default FriendsViewContainerMigrated; 