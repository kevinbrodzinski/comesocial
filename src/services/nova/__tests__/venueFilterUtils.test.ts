
import { describe, test, expect } from 'vitest';
import { 
  detectMultipleIntents, 
  getSmartRadius, 
  shouldFilterOpenNow, 
  calculateIntentScore 
} from '../venueFilterUtils';

describe('venueFilterUtils', () => {
  describe('detectMultipleIntents', () => {
    test('detects single intent correctly', () => {
      expect(detectMultipleIntents('looking for chill spots')).toContain('chill');
    });

    test('detects multiple intents', () => {
      const intents = detectMultipleIntents('party vibes with unique hidden gems');
      expect(intents).toContain('party');
      expect(intents).toContain('unique');
    });

    test('returns empty array for no matching intents', () => {
      expect(detectMultipleIntents('random text')).toEqual([]);
    });
  });

  describe('getSmartRadius', () => {
    test('returns correct radius for unique venues', () => {
      expect(getSmartRadius(['unique'])).toBe(8000);
    });

    test('returns correct radius for chill venues', () => {
      expect(getSmartRadius(['chill'])).toBe(6000);
    });

    test('returns correct radius for party venues', () => {
      expect(getSmartRadius(['party'])).toBe(3000);
    });

    test('returns default radius for no intents', () => {
      expect(getSmartRadius([])).toBe(5000);
    });
  });

  describe('shouldFilterOpenNow', () => {
    test('detects open now keywords', () => {
      expect(shouldFilterOpenNow('what is open now')).toBe(true);
      expect(shouldFilterOpenNow('places open tonight')).toBe(true);
      expect(shouldFilterOpenNow('currently available')).toBe(true);
    });

    test('returns false for non-open keywords', () => {
      expect(shouldFilterOpenNow('good spots tomorrow')).toBe(false);
    });
  });

  describe('calculateIntentScore', () => {
    const mockVenue = {
      crowdLevel: 80,
      priceLevel: 3,
      features: ['DJ', 'Dancing'],
      type: 'Nightclub',
      rating: 4.6
    };

    test('scores party venues correctly', () => {
      const score = calculateIntentScore(mockVenue, ['party']);
      expect(score).toBeGreaterThan(0);
    });

    test('gives higher scores for matching features', () => {
      const venueWithMoreFeatures = {
        ...mockVenue,
        features: ['DJ', 'Dancing', 'Late Night', 'Music']
      };
      const score1 = calculateIntentScore(mockVenue, ['party']);
      const score2 = calculateIntentScore(venueWithMoreFeatures, ['party']);
      expect(score2).toBeGreaterThan(score1);
    });
  });
});
