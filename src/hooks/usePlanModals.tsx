
import { useState } from 'react';

export const usePlanModals = () => {
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [showVenueBrowser, setShowVenueBrowser] = useState(false);
  const [showCustomVenueModal, setShowCustomVenueModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  return {
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
  };
};
