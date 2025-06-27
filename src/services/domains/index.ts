
import { nightlifeHandler, NightlifeVenue } from './nightlife/NightlifeHandler';
import { diningHandler, DiningVenue } from './dining/DiningHandler';

export { nightlifeHandler, type NightlifeVenue } from './nightlife/NightlifeHandler';
export { diningHandler, type DiningVenue } from './dining/DiningHandler';

// Domain registry for easy access
export const domainHandlers = {
  nightlife: nightlifeHandler,
  dining: diningHandler,
  // travel: travelHandler,    // TODO: Implement
  // events: eventsHandler,    // TODO: Implement  
  // shopping: shoppingHandler // TODO: Implement
};

export type DomainType = keyof typeof domainHandlers;
