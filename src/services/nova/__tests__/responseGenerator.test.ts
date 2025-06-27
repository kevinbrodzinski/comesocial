
import { describe, test, expect } from 'vitest';
import { 
  generateSmartExplanation, 
  classifyIntent, 
  generateContextualResponse 
} from '../responseGenerator';

describe('responseGenerator', () => {
  describe('classifyIntent', () => {
    test('classifies venue search intent', () => {
      expect(classifyIntent('show me bars nearby')).toBe('venue_search');
      expect(classifyIntent('find restaurants')).toBe('venue_search');
      expect(classifyIntent('looking for clubs')).toBe('venue_search');
    });

    test('classifies location query intent', () => {
      expect(classifyIntent('where am I?')).toBe('location_query');
      expect(classifyIntent('places near me')).toBe('location_query');
    });

    test('classifies general chat intent', () => {
      expect(classifyIntent('hello how are you')).toBe('general_chat');
      expect(classifyIntent('thanks for the help')).toBe('general_chat');
    });
  });

  describe('generateSmartExplanation', () => {
    const mockVenues = [
      { name: 'Test Venue 1', rating: 4.5 },
      { name: 'Test Venue 2', rating: 4.2 }
    ];

    test('generates explanation for chill intent', () => {
      const explanation = generateSmartExplanation('chill spots', mockVenues);
      expect(explanation).toContain('quieter spots');
      expect(explanation).toContain('relaxed vibe');
    });

    test('generates explanation for party intent', () => {
      const explanation = generateSmartExplanation('party vibes', mockVenues);
      expect(explanation).toContain('high energy');
      expect(explanation).toContain('music');
    });

    test('handles empty venues', () => {
      const explanation = generateSmartExplanation('any message', []);
      expect(explanation).toBe('No venues found matching your criteria.');
    });
  });

  describe('generateContextualResponse', () => {
    test('returns a helpful response', () => {
      const response = generateContextualResponse('test message', {});
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });
  });
});
