
export interface TimeBasedTrigger {
  hour: number;
  minute: number;
  days: number[];
  predictionType: string;
}

export class TriggerManager {
  private triggers: TimeBasedTrigger[] = [
    { hour: 19, minute: 0, days: [5, 6], predictionType: 'evening-rush' },
    { hour: 22, minute: 30, days: [5, 6], predictionType: 'peak-hours' },
    { hour: 21, minute: 0, days: [0, 1, 2, 3, 4], predictionType: 'weeknight-optimal' }
  ];

  checkTimeBasedTriggers(): TimeBasedTrigger[] {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay();

    return this.triggers.filter(trigger => 
      trigger.hour === currentHour &&
      trigger.minute === currentMinute &&
      trigger.days.includes(currentDay)
    );
  }

  addTrigger(trigger: TimeBasedTrigger): void {
    this.triggers.push(trigger);
  }

  removeTrigger(predictionType: string): void {
    this.triggers = this.triggers.filter(t => t.predictionType !== predictionType);
  }

  getTriggers(): TimeBasedTrigger[] {
    return [...this.triggers];
  }
}

export const triggerManager = new TriggerManager();
