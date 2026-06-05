import eventBus, { EVENTS } from './eventBus';
import { handleLeaderboardRankCheck } from './leaderboard.service';
import { checkPathUnlocks } from './unlock.service';
import { createNotification } from './notification.service';
import { updateEventLogStatus } from './eventLog.service';
import { withRetry } from '../utils/retry';

/**
 * Registers global event handlers for decoupled, asynchronous operations
 */
export const initEventListeners = () => {
  console.log('⚡ Event Bus: Initializing event listeners...');

  eventBus.on(EVENTS.LESSON_COMPLETED, async (data: {
    userId: string;
    progressId: string;
    xpOld: number;
    xpNew: number;
    streakOld: number;
    streakNew: number;
    completedBefore: number;
    completedAfter: number;
    oldCompletedLessons: any;
    oldSkillMastery: any;
    newCompletedLessons: any;
    newSkillMastery: any;
    traceId?: string;
  }) => {
    const traceId = data.traceId || `tr_async_${Math.random().toString(36).substring(2, 9)}`;
    
    // Process inside a separate asynchronous context (setImmediate)
    setImmediate(async () => {
      try {
        console.log(`[EventBus] [${traceId}] ⚙️ Asynchronous handlers starting for "${EVENTS.LESSON_COMPLETED}" (user: ${data.userId})`);
        const start = performance.now();

        const tasks: Promise<any>[] = [];

        // Task 1: Notifications
        if (data.completedAfter > data.completedBefore) {
          tasks.push(
            withRetry(
              async () => {
                const xpEarned = data.xpNew - data.xpOld;
                let message = 'You completed a new challenge!';
                if (xpEarned > 0) {
                  message += ` You earned +${xpEarned} XP.`;
                }
                if (data.streakNew > data.streakOld) {
                  message += ` Streak active: ${data.streakNew} days! 🔥`;
                }
                await createNotification(data.userId, 'Challenge Complete! 🎉', message, 'lesson_completed');
              },
              3,
              1000,
              `Notification: Lesson Completion for user ${data.userId}`
            )
          );
        }

        // Task 2: Leaderboard check
        tasks.push(
          withRetry(
            async () => {
              await handleLeaderboardRankCheck(data.userId, data.progressId, data.xpOld, data.xpNew);
            },
            3,
            1000,
            `Leaderboard Check for user ${data.userId}`
          )
        );

        // Task 3: Pathway Unlock Checks
        tasks.push(
          withRetry(
            async () => {
              await checkPathUnlocks(
                data.userId,
                data.oldCompletedLessons,
                data.oldSkillMastery,
                data.newCompletedLessons,
                data.newSkillMastery
              );
            },
            3,
            1000,
            `Pathway Unlock Checks for user ${data.userId}`
          )
        );

        // Execute all tasks concurrently and isolate their failures
        const results = await Promise.allSettled(tasks);
        
        const duration = (performance.now() - start).toFixed(2);
        console.log(`[EventBus] [${traceId}] ✅ Asynchronous handlers finished in ${duration}ms`);

        // Check if any task failed
        const rejections = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
        
        if (rejections.length > 0) {
          const errorsList = rejections.map((r, i) => `Task ${i+1}: ${r.reason?.message || String(r.reason)}`).join('; ');
          console.error(`[EventBus] [${traceId}] ❌ ${rejections.length} tasks failed execution. Moving to Dead Letter Queue.`);
          
          // Update event log status to failed with aggregated errors (Dead-Letter state)
          await updateEventLogStatus(traceId, 'failed', 3, errorsList);
        } else {
          // All tasks completed successfully, mark event log as success
          await updateEventLogStatus(traceId, 'success', 1);
        }

      } catch (error) {
        console.error(`[EventBus] [${traceId}] ❌ Critical unhandled error in event listener for "${EVENTS.LESSON_COMPLETED}":`, error);
      }
    });
  });
};
