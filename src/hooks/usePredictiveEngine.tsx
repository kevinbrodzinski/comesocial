
import { useState, useEffect } from 'react';
import { useNotificationScheduler } from './useNotificationScheduler';
import { Venue } from '@/data/venuesData';
import { predictiveEngine } from '../services/intelligence/PredictiveEngine';
import { VenuePrediction } from '../services/intelligence/prediction/PredictionGenerator';

export const usePredictiveEngine = (venues: Venue[]) => {
  const [predictions, setPredictions] = useState<VenuePrediction[]>([]);
  const [isActive, setIsActive] = useState(false);
  const { scheduleCrowdAlert } = useNotificationScheduler();

  // Initialize and start the predictive engine
  useEffect(() => {
    if (isActive) {
      predictiveEngine.start();
    } else {
      predictiveEngine.stop();
    }

    return () => {
      predictiveEngine.stop();
    };
  }, [isActive]);

  // Update predictions from the engine
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        const enginePredictions = predictiveEngine.getPredictions();
        setPredictions(enginePredictions);

        // Send notifications for high-confidence predictions
        enginePredictions
          .filter(p => p.confidence > 0.75)
          .forEach(prediction => {
            const venue = venues.find(v => v.id === prediction.venueId);
            if (venue) {
              scheduleCrowdAlert(venue.name, venue.crowdLevel);
            }
          });
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isActive, venues, scheduleCrowdAlert]);

  // Auto-activate during evening hours
  useEffect(() => {
    const hour = new Date().getHours();
    const isEveningHours = hour >= 17 && hour <= 2;
    setIsActive(isEveningHours);
  }, []);

  const generateManualPrediction = (venueId: number) => {
    const venue = venues.find(v => v.id === venueId);
    if (!venue) return null;

    const prediction = predictiveEngine.generateManualPrediction(venueId, venue);
    if (prediction) {
      setPredictions(prev => {
        const filtered = prev.filter(p => p.venueId !== venueId);
        return [...filtered, prediction];
      });
    }
    
    return prediction;
  };

  const clearPredictions = () => {
    predictiveEngine.clearPredictions();
    setPredictions([]);
  };

  return {
    predictions,
    isActive,
    setIsActive,
    generateManualPrediction,
    clearPredictions,
    stats: predictiveEngine.getStats()
  };
};
