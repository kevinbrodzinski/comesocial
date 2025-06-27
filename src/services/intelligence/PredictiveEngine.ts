
import { triggerManager } from './prediction/TriggerManager';
import { predictionGenerator, VenuePrediction } from './prediction/PredictionGenerator';
import { errorHandler } from './ErrorHandler';
import { aiResponseValidator } from './AIResponseValidator';
import { z } from 'zod';

// Define Zod schema for prediction validation
const PredictionValidationSchema = z.object({
  venueId: z.number(),
  prediction: z.string(),
  confidence: z.number()
});

export class PredictiveEngine {
  private predictions: Map<number, VenuePrediction> = new Map();
  private isActive: boolean = false;

  start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('🔮 Predictive Engine started');
    
    // Start monitoring for triggers
    this.startTriggerMonitoring();
  }

  stop(): void {
    this.isActive = false;
    console.log('⏹️ Predictive Engine stopped');
  }

  private startTriggerMonitoring(): void {
    if (!this.isActive) return;

    setInterval(() => {
      if (!this.isActive) return;
      
      try {
        const activeTriggers = triggerManager.checkTimeBasedTriggers();
        
        activeTriggers.forEach(trigger => {
          this.processTrigger(trigger);
        });
      } catch (error) {
        errorHandler.handleError(
          'ai_processing',
          'Failed to process prediction triggers',
          {
            component: 'PredictiveEngine',
            operation: 'startTriggerMonitoring',
            data: { error },
            timestamp: new Date()
          },
          true
        );
      }
    }, 60000); // Check every minute
  }

  private processTrigger(trigger: any): void {
    try {
      // This would be called with actual venues from the context
      console.log(`🎯 Processing trigger: ${trigger.predictionType}`);
      
      // Generate predictions based on trigger type
      // In a real implementation, this would access venue data
      const samplePrediction = predictionGenerator.generatePrediction(
        { id: 1, name: 'Sample Venue', type: 'Bar', crowdLevel: 50 } as any,
        trigger.predictionType
      );

      // Validate prediction using proper Zod schema
      const validationData = {
        venueId: samplePrediction.venueId,
        prediction: samplePrediction.prediction,
        confidence: samplePrediction.confidence
      };

      const isValid = aiResponseValidator.validateStructuredOutput(
        PredictionValidationSchema,
        validationData,
        'PredictiveEngine'
      );

      if (isValid) {
        this.predictions.set(samplePrediction.venueId, samplePrediction);
        console.log(`✨ Prediction generated for venue ${samplePrediction.venueId}`);
      }
    } catch (error) {
      errorHandler.handleError(
        'ai_processing',
        'Failed to process trigger',
        {
          component: 'PredictiveEngine',
          operation: 'processTrigger',
          data: { trigger, error },
          timestamp: new Date()
        },
        true
      );
    }
  }

  // Add missing method for generating predictions with context
  generatePredictions(context: any): VenuePrediction[] {
    try {
      const predictions: VenuePrediction[] = [];
      
      // Generate venue recommendations based on context
      if (context.liveVenues?.length > 0) {
        context.liveVenues.slice(0, 3).forEach((venue: any) => {
          const prediction = predictionGenerator.generatePrediction(venue, 'venue_recommendation');
          predictions.push(prediction);
        });
      }
      
      // Generate timing suggestions
      const currentHour = new Date().getHours();
      if (currentHour >= 17 && currentHour <= 23) {
        predictions.push({
          id: `timing_${Date.now()}`,
          type: 'timing_suggestion',
          prediction: 'Great time for evening activities',
          confidence: 0.8,
          metadata: { timeContext: 'evening' }
        } as any);
      }
      
      return predictions;
    } catch (error) {
      console.error('Failed to generate predictions:', error);
      return [];
    }
  }

  // Add missing method for getting predictions by type
  getPredictionsByType(type: string): VenuePrediction[] {
    return Array.from(this.predictions.values())
      .filter(p => (p as any).type === type)
      .sort((a, b) => b.confidence - a.confidence);
  }

  // Add missing method for updating prediction accuracy
  updatePredictionAccuracy(predictionId: string, wasAccurate: boolean): void {
    try {
      console.log(`📊 Updating prediction accuracy: ${predictionId} = ${wasAccurate}`);
      // In a real implementation, this would update ML model weights
      // For now, just log the feedback
    } catch (error) {
      errorHandler.handleError(
        'ai_processing',
        'Failed to update prediction accuracy',
        {
          component: 'PredictiveEngine',
          operation: 'updatePredictionAccuracy',
          data: { predictionId, wasAccurate, error },
          timestamp: new Date()
        },
        false
      );
    }
  }

  generateManualPrediction(venueId: number, venue: any): VenuePrediction | null {
    try {
      const prediction = predictionGenerator.generatePrediction(venue, 'manual');
      
      // Validate the prediction with proper Zod schema
      const validationData = {
        venueId: prediction.venueId,
        prediction: prediction.prediction,
        confidence: prediction.confidence
      };

      const isValid = aiResponseValidator.validateStructuredOutput(
        PredictionValidationSchema,
        validationData,
        'PredictiveEngine'
      );

      if (isValid) {
        this.predictions.set(venueId, prediction);
        return prediction;
      }
    } catch (error) {
      errorHandler.handleError(
        'ai_processing',
        'Failed to generate manual prediction',
        {
          component: 'PredictiveEngine',
          operation: 'generateManualPrediction',
          data: { venueId, error },
          timestamp: new Date()
        },
        true
      );
    }
    
    return null;
  }

  getPredictions(): VenuePrediction[] {
    return Array.from(this.predictions.values())
      .sort((a, b) => b.confidence - a.confidence);
  }

  getPrediction(venueId: number): VenuePrediction | null {
    return this.predictions.get(venueId) || null;
  }

  clearPredictions(): void {
    this.predictions.clear();
  }

  getStats() {
    return {
      totalPredictions: this.predictions.size,
      isActive: this.isActive,
      highConfidencePredictions: Array.from(this.predictions.values())
        .filter(p => p.confidence > 0.75).length
    };
  }
}

export const predictiveEngine = new PredictiveEngine();
