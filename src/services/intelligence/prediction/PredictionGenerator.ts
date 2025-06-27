
import { Venue } from '@/data/venuesData';

export interface VenuePrediction {
  venueId: number;
  venue: string;
  prediction: 'crowd-rising' | 'crowd-falling' | 'optimal-timing' | 'parking-warning';
  confidence: number;
  timeframe: string;
  message: string;
  actionLabel: string;
}

export class PredictionGenerator {
  generatePrediction(venue: Venue, predictionType: string): VenuePrediction {
    const hour = new Date().getHours();
    
    if (predictionType === 'evening-rush' && venue.type === 'Rooftop Bar') {
      return {
        venueId: venue.id,
        venue: venue.name,
        prediction: 'crowd-rising',
        confidence: 0.85,
        timeframe: 'next 30 minutes',
        message: `${venue.name} crowd is building—great energy brewing!`,
        actionLabel: 'Check it out'
      };
    }
    
    if (predictionType === 'peak-hours' && venue.crowdLevel > 80) {
      return {
        venueId: venue.id,
        venue: venue.name,
        prediction: 'parking-warning',
        confidence: 0.75,
        timeframe: 'soon',
        message: `${venue.name} is packed—parking might be tough soon`,
        actionLabel: 'Get directions'
      };
    }
    
    if (predictionType === 'weeknight-optimal' && venue.crowdLevel < 60) {
      return {
        venueId: venue.id,
        venue: venue.name,
        prediction: 'optimal-timing',
        confidence: 0.70,
        timeframe: 'right now',
        message: `Perfect time to swing by ${venue.name}—nice and chill`,
        actionLabel: 'Head over'
      };
    }

    return this.generateDefaultPrediction(venue);
  }

  private generateDefaultPrediction(venue: Venue): VenuePrediction {
    const isRising = Math.random() > 0.5;
    return {
      venueId: venue.id,
      venue: venue.name,
      prediction: isRising ? 'crowd-rising' : 'crowd-falling',
      confidence: Math.random() * 0.3 + 0.6,
      timeframe: 'next hour',
      message: `${venue.name} crowd is ${isRising ? 'building up' : 'cooling off'}—${isRising ? 'energy rising' : 'perfect for conversation'}`,
      actionLabel: isRising ? 'Join the buzz' : 'Grab a spot'
    };
  }

  filterRelevantVenues(venues: Venue[], predictionType: string): Venue[] {
    if (predictionType === 'evening-rush') {
      return venues.filter(venue => 
        venue.type.includes('Bar') || venue.type.includes('Lounge')
      ).slice(0, 2);
    }
    
    if (predictionType === 'peak-hours') {
      return venues.filter(venue => venue.crowdLevel > 70).slice(0, 2);
    }
    
    return venues.filter(venue => venue.crowdLevel < 70).slice(0, 2);
  }
}

export const predictionGenerator = new PredictionGenerator();
