import { EventEmitter } from 'events';
import { recordEventEmission } from './processors/eventLog.processor';

/**
 * Compile-time safe constants for all system events.
 */
export const EVENTS = {
  LESSON_COMPLETED: 'lesson.completed',
  STREAK_UPDATED: 'streak.updated',
} as const;

export type SystemEvent = typeof EVENTS[keyof typeof EVENTS];

class CFTEventBus extends EventEmitter {
  override emit(eventName: string | symbol, ...args: any[]): boolean {
    const traceId = `tr_${Math.random().toString(36).substring(2, 9)}`;
    
    // Inject traceId and event schema version if the payload is an object
    if (args[0] && typeof args[0] === 'object') {
      args[0].traceId = args[0].traceId || traceId;
      args[0].version = args[0].version || 1;
    }

    const payloadString = args[0] ? JSON.stringify(args[0]) : '';
    console.log(`[EventBus] [${traceId}]  EMIT event: "${String(eventName)}" | payload: ${payloadString}`);
    
    // Asynchronously record event execution context for reliability & observability out-of-band
    setImmediate(() => {
      recordEventEmission(String(eventName), traceId, args[0]);
    });

    const start = performance.now();
    const result = super.emit(eventName, ...args);
    const duration = (performance.now() - start).toFixed(2);
    
    console.log(`[EventBus] [${traceId}]  FINISHED synchronous event processing for: "${String(eventName)}" in ${duration}ms`);
    return result;
  }
}

const eventBus = new CFTEventBus();

export default eventBus;
export { eventBus };
