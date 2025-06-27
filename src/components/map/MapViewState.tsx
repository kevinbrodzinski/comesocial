import { useState } from 'react';
import { Venue } from '@/data/venuesData';
import { Friend } from '@/data/friendsData';

export interface MapViewState {
  checkInModalOpen: boolean;
  setCheckInModalOpen: (open: boolean) => void;
  selectedPlanForMap: any;
  setSelectedPlanForMap: (plan: any) => void;
  temporarySearchPins: any[];
  setTemporarySearchPins: (pins: any[]) => void;
  createPlanModalOpen: boolean;
  setCreatePlanModalOpen: (open: boolean) => void;
  planCreationData: any;
  setPlanCreationData: (data: any) => void;
  planSheetOpen: boolean;
  setPlanSheetOpen: (open: boolean) => void;
  planBottomSheetOpen: boolean;
  setPlanBottomSheetOpen: (open: boolean) => void;
  quickChatFriends: Friend[];
  setQuickChatFriends: (friends: Friend[]) => void;
  quickChatVenue: Venue | undefined;
  setQuickChatVenue: (venue: Venue | undefined) => void;
  venueInteractionOpen: boolean;
  setVenueInteractionOpen: (open: boolean) => void;
  selectedVenueForInteraction: Venue | null;
  setSelectedVenueForInteraction: (venue: Venue | null) => void;
}

export const useMapViewState = (): MapViewState => {
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selectedPlanForMap, setSelectedPlanForMap] = useState<any>(null);
  const [temporarySearchPins, setTemporarySearchPins] = useState<any[]>([]);
  const [createPlanModalOpen, setCreatePlanModalOpen] = useState(false);
  const [planCreationData, setPlanCreationData] = useState<any>(null);
  const [planSheetOpen, setPlanSheetOpen] = useState(false);
  const [planBottomSheetOpen, setPlanBottomSheetOpen] = useState(false);
  const [quickChatFriends, setQuickChatFriends] = useState<Friend[]>([]);
  const [quickChatVenue, setQuickChatVenue] = useState<Venue | undefined>(undefined);
  const [venueInteractionOpen, setVenueInteractionOpen] = useState(false);
  const [selectedVenueForInteraction, setSelectedVenueForInteraction] = useState<Venue | null>(null);

  return {
    checkInModalOpen,
    setCheckInModalOpen,
    selectedPlanForMap,
    setSelectedPlanForMap,
    temporarySearchPins,
    setTemporarySearchPins,
    createPlanModalOpen,
    setCreatePlanModalOpen,
    planCreationData,
    setPlanCreationData,
    planSheetOpen,
    setPlanSheetOpen,
    planBottomSheetOpen,
    setPlanBottomSheetOpen,
    quickChatFriends,
    setQuickChatFriends,
    quickChatVenue,
    setQuickChatVenue,
    venueInteractionOpen,
    setVenueInteractionOpen,
    selectedVenueForInteraction,
    setSelectedVenueForInteraction
  };
};
