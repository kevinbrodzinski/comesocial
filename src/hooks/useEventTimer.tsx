
import { useState, useEffect } from 'react';

export const useEventTimer = (eventDate: string, eventTime: string) => {
  const [timeUntil, setTimeUntil] = useState('');

  useEffect(() => {
    const calculateTimeUntil = () => {
      const now = new Date();
      let eventDateTime: Date;

      // Parse the event date and time
      if (eventDate === 'Tonight') {
        eventDateTime = new Date();
        eventDateTime.setHours(parseInt(eventTime.split(':')[0]) + (eventTime.includes('PM') && !eventTime.includes('12') ? 12 : 0));
        eventDateTime.setMinutes(parseInt(eventTime.split(':')[1]));
        eventDateTime.setSeconds(0);
      } else if (eventDate === 'This Sunday') {
        eventDateTime = new Date();
        const daysUntilSunday = (7 - now.getDay()) % 7;
        eventDateTime.setDate(now.getDate() + daysUntilSunday);
        eventDateTime.setHours(parseInt(eventTime.split(':')[0]) + (eventTime.includes('PM') && !eventTime.includes('12') ? 12 : 0));
        eventDateTime.setMinutes(parseInt(eventTime.split(':')[1]));
        eventDateTime.setSeconds(0);
      } else if (eventDate === 'Saturday') {
        eventDateTime = new Date();
        const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
        eventDateTime.setDate(now.getDate() + daysUntilSaturday);
        eventDateTime.setHours(parseInt(eventTime.split(':')[0]) + (eventTime.includes('PM') && !eventTime.includes('12') ? 12 : 0));
        eventDateTime.setMinutes(parseInt(eventTime.split(':')[1]));
        eventDateTime.setSeconds(0);
      } else if (eventDate === 'Next Friday') {
        eventDateTime = new Date();
        const daysUntilNextFriday = (5 - now.getDay() + 7) % 7 || 7;
        eventDateTime.setDate(now.getDate() + daysUntilNextFriday);
        eventDateTime.setHours(parseInt(eventTime.split(':')[0]) + (eventTime.includes('PM') && !eventTime.includes('12') ? 12 : 0));
        eventDateTime.setMinutes(parseInt(eventTime.split(':')[1]));
        eventDateTime.setSeconds(0);
      } else {
        return 'Event time unknown';
      }

      const timeDiff = eventDateTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        return 'Event started';
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days}d ${remainingHours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    };

    const updateTimer = () => {
      setTimeUntil(calculateTimeUntil());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [eventDate, eventTime]);

  return timeUntil;
};
