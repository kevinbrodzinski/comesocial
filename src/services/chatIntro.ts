
const INTRO_STORAGE_KEY = 'chat_intro_shown';

export const hasIntroBeenShown = (draftId: string): boolean => {
  const shown = localStorage.getItem(`${INTRO_STORAGE_KEY}_${draftId}`);
  return shown === 'true';
};

export const markIntroAsShown = (draftId: string): void => {
  localStorage.setItem(`${INTRO_STORAGE_KEY}_${draftId}`, 'true');
};

export const getIntroMessage = (): string => {
  return "Welcome to plan chat! Use the action pills above to collaborate on your plan. Chat with your team and get AI assistance for planning decisions.";
};
