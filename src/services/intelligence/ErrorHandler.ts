
interface ErrorContext {
  component: string;
  operation: string;
  data?: any;
  timestamp: Date;
}

interface SystemError {
  id: string;
  type: 'validation' | 'ai_call' | 'prediction' | 'notification' | 'data_processing' | 'ai_processing';
  message: string;
  context: ErrorContext;
  retryable: boolean;
  retryCount?: number;
  resolved?: boolean;
}

export class ErrorHandler {
  private errors: Map<string, SystemError> = new Map();
  private readonly maxRetries = 3;
  private readonly storageKey = 'nova_system_errors';

  constructor() {
    this.loadErrors();
  }

  // Log and handle errors with context
  handleError(
    type: SystemError['type'],
    message: string,
    context: ErrorContext,
    retryable: boolean = false
  ): string {
    const errorId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const error: SystemError = {
      id: errorId,
      type,
      message,
      context: {
        ...context,
        timestamp: new Date()
      },
      retryable,
      retryCount: 0,
      resolved: false
    };

    this.errors.set(errorId, error);
    this.saveErrors();

    // Log error with structured data
    console.error(`🚨 System Error [${type}]:`, {
      id: errorId,
      message,
      component: context.component,
      operation: context.operation,
      retryable,
      data: context.data
    });

    return errorId;
  }

  // Retry failed operations
  async retryOperation<T>(
    errorId: string,
    operation: () => Promise<T>
  ): Promise<T | null> {
    const error = this.errors.get(errorId);
    if (!error || !error.retryable || (error.retryCount || 0) >= this.maxRetries) {
      return null;
    }

    try {
      error.retryCount = (error.retryCount || 0) + 1;
      const result = await operation();
      
      // Mark as resolved
      error.resolved = true;
      this.saveErrors();
      
      console.log(`✅ Retry successful for error ${errorId}`);
      return result;
    } catch (retryError) {
      console.error(`❌ Retry failed for error ${errorId}:`, retryError);
      this.saveErrors();
      return null;
    }
  }

  // Get unresolved errors for monitoring
  getUnresolvedErrors(): SystemError[] {
    return Array.from(this.errors.values())
      .filter(error => !error.resolved)
      .sort((a, b) => b.context.timestamp.getTime() - a.context.timestamp.getTime());
  }

  // Get error statistics
  getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    resolved: number;
    retryable: number;
  } {
    const errors = Array.from(this.errors.values());
    
    return {
      total: errors.length,
      byType: errors.reduce((acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      resolved: errors.filter(e => e.resolved).length,
      retryable: errors.filter(e => e.retryable).length
    };
  }

  // Clear old resolved errors
  cleanup(): void {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
    
    for (const [id, error] of this.errors.entries()) {
      if (error.resolved && error.context.timestamp < cutoff) {
        this.errors.delete(id);
      }
    }
    
    this.saveErrors();
  }

  private saveErrors(): void {
    try {
      const errorData = Array.from(this.errors.entries()).slice(-100); // Keep last 100 errors
      localStorage.setItem(this.storageKey, JSON.stringify(errorData));
    } catch (error) {
      console.warn('Failed to save errors:', error);
    }
  }

  private loadErrors(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const errorData: [string, SystemError][] = JSON.parse(stored);
        this.errors = new Map(errorData.map(([id, error]) => [
          id,
          {
            ...error,
            context: {
              ...error.context,
              timestamp: new Date(error.context.timestamp)
            }
          }
        ]));
      }
    } catch (error) {
      console.warn('Failed to load errors:', error);
    }
  }
}

export const errorHandler = new ErrorHandler();
