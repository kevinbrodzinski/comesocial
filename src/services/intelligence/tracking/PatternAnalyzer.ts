
interface EventPattern {
  pattern: string;
  frequency: number;
  lastOccurrence: Date;
  confidence: number;
  metadata: Record<string, any>;
}

export class PatternAnalyzer {
  private patterns: Map<string, EventPattern> = new Map();

  updatePatterns(event: any): void {
    const patternKeys = [
      `${event.type}_${event.context.timeOfDay}`,
      `${event.type}_${event.context.dayOfWeek}`,
      `${event.type}_${event.context.timeOfDay}_${event.context.dayOfWeek}`
    ];

    patternKeys.forEach(key => {
      const existing = this.patterns.get(key);
      if (existing) {
        existing.frequency += 1;
        existing.lastOccurrence = event.timestamp;
        existing.confidence = Math.min(existing.confidence + 0.1, 1.0);
      } else {
        this.patterns.set(key, {
          pattern: key,
          frequency: 1,
          lastOccurrence: event.timestamp,
          confidence: 0.3,
          metadata: { type: event.type, context: event.context }
        });
      }
    });
  }

  getBehaviorPatterns(): Map<string, EventPattern> {
    return new Map(this.patterns);
  }

  loadPatterns(patterns: Map<string, EventPattern>): void {
    this.patterns = patterns;
  }
}

export const patternAnalyzer = new PatternAnalyzer();
