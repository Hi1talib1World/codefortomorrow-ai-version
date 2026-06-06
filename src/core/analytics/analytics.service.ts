import Progress from '../../../src/models/progress.model';
import EventLog from '../../../src/models/eventLog.model';
import AnalyticsCache from '../../../src/models/analyticsCache.model';

export interface ILearningAnalytics {
  xpEconomy: {
    totalXp: number;
    averageXp: number;
    medianXp: number;
    maxXp: number;
    minXp: number;
  };
  streakDistribution: {
    zero: number;
    oneToTwo: number;
    threeToFour: number;
    fiveToNine: number;
    tenPlus: number;
  };
  engagementPerLesson: {
    pathId: string;
    lessonId: number;
    completionsCount: number;
  }[];
  dropOffPoints: {
    pathId: string;
    lessonId: number;
    completionsCount: number;
    dropOffRatePct: number; // Percentage decrease compared to the previous lesson in the path
  }[];
  eventObservability: {
    totalEvents: number;
    successEvents: number;
    failedEvents: number;
    pendingEvents: number;
    failureRatePct: number;
  };
  cachedAt?: Date;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Retrieves platform learning analytics. Uses cached statistics in MongoDB when available
 * to prevent heavy runtime queries, falling back to on-demand aggregation if cache is expired.
 * 
 * @param forceRefresh Set to true to force recalculation of analytics
 */
export const getLearningAnalytics = async (forceRefresh = false): Promise<ILearningAnalytics> => {
  try {
    // 1. Check cache if forceRefresh is false
    if (!forceRefresh) {
      const cached = await AnalyticsCache.findOne({ key: 'learning_analytics' });
      if (cached && (Date.now() - new Date(cached.updatedAt).getTime() < CACHE_TTL_MS)) {
        console.log('⚡ [Analytics] Returning cached platform analytics (Cache Hit)');
        return {
          ...cached.data,
          cachedAt: cached.updatedAt,
        };
      }
    }

    console.log('⚡ [Analytics] Cache expired or force refresh requested. Recomputing learning metrics...');
    const start = performance.now();
    const progresses = await Progress.find();
    const totalStudents = progresses.length;

    let data: ILearningAnalytics;

    if (totalStudents === 0) {
      data = {
        xpEconomy: { totalXp: 0, averageXp: 0, medianXp: 0, maxXp: 0, minXp: 0 },
        streakDistribution: { zero: 0, oneToTwo: 0, threeToFour: 0, fiveToNine: 0, tenPlus: 0 },
        engagementPerLesson: [],
        dropOffPoints: [],
        eventObservability: { totalEvents: 0, successEvents: 0, failedEvents: 0, pendingEvents: 0, failureRatePct: 0 }
      };
    } else {
      // 1. XP Economy Balance
      const xps = progresses.map(p => p.xp || 0).sort((a, b) => a - b);
      const totalXp = xps.reduce((sum, val) => sum + val, 0);
      const averageXp = totalXp / totalStudents;
      const medianXp = xps[Math.floor(totalStudents / 2)] || 0;
      const maxXp = xps[xps.length - 1] || 0;
      const minXp = xps[0] || 0;

      // 2. Streak Distribution
      let zero = 0, oneToTwo = 0, threeToFour = 0, fiveToNine = 0, tenPlus = 0;
      progresses.forEach(p => {
        const streak = p.streak || 0;
        if (streak === 0) zero++;
        else if (streak <= 2) oneToTwo++;
        else if (streak <= 4) threeToFour++;
        else if (streak <= 9) fiveToNine++;
        else tenPlus++;
      });

      // 3. Engagement Per Lesson
      const pathLessonCompletions = new Map<string, Map<number, number>>();

      progresses.forEach(p => {
        if (p.completedLessons) {
          p.completedLessons.forEach((lessonIds, pathId) => {
            if (!pathLessonCompletions.has(pathId)) {
              pathLessonCompletions.set(pathId, new Map<number, number>());
            }
            const lessonsMap = pathLessonCompletions.get(pathId)!;
            
            if (Array.isArray(lessonIds)) {
              lessonIds.forEach(lessonId => {
                lessonsMap.set(lessonId, (lessonsMap.get(lessonId) || 0) + 1);
              });
            }
          });
        }
      });

      const engagementPerLesson: ILearningAnalytics['engagementPerLesson'] = [];
      pathLessonCompletions.forEach((lessonsMap, pathId) => {
        lessonsMap.forEach((completionsCount, lessonId) => {
          engagementPerLesson.push({ pathId, lessonId, completionsCount });
        });
      });

      engagementPerLesson.sort((a, b) => a.pathId.localeCompare(b.pathId) || a.lessonId - b.lessonId);

      // 4. Drop-off Points
      const dropOffPoints: ILearningAnalytics['dropOffPoints'] = [];
      pathLessonCompletions.forEach((lessonsMap, pathId) => {
        const sortedLessons = Array.from(lessonsMap.entries()).sort((a, b) => a[0] - b[0]);
        for (let i = 1; i < sortedLessons.length; i++) {
          const [prevLessonId, prevCompletions] = sortedLessons[i - 1];
          const [currLessonId, currCompletions] = sortedLessons[i];
          if (prevCompletions > 0) {
            const diff = prevCompletions - currCompletions;
            if (diff > 0) {
              const dropOffRatePct = Math.round((diff / prevCompletions) * 100);
              dropOffPoints.push({
                pathId,
                lessonId: currLessonId,
                completionsCount: currCompletions,
                dropOffRatePct
              });
            }
          }
        }
      });

      dropOffPoints.sort((a, b) => b.dropOffRatePct - a.dropOffRatePct);

      // 5. Event Observability (Auditing from event_logs)
      const totalEvents = await EventLog.countDocuments();
      const successEvents = await EventLog.countDocuments({ status: 'success' });
      const failedEvents = await EventLog.countDocuments({ status: 'failed' });
      const pendingEvents = await EventLog.countDocuments({ status: 'pending' });
      const failureRatePct = totalEvents > 0 ? Math.round((failedEvents / totalEvents) * 100) : 0;

      data = {
        xpEconomy: {
          totalXp,
          averageXp: Math.round(averageXp * 10) / 10,
          medianXp,
          maxXp,
          minXp
        },
        streakDistribution: { zero, oneToTwo, threeToFour, fiveToNine, tenPlus },
        engagementPerLesson,
        dropOffPoints: dropOffPoints.slice(0, 10),
        eventObservability: {
          totalEvents,
          successEvents,
          failedEvents,
          pendingEvents,
          failureRatePct
        }
      };
    }

    const duration = (performance.now() - start).toFixed(2);
    console.log(`⚡ [Analytics] Successfully aggregated platform analytics in ${duration}ms`);

    // Cache result in MongoDB
    const now = new Date();
    await AnalyticsCache.findOneAndUpdate(
      { key: 'learning_analytics' },
      { data, updatedAt: now },
      { upsert: true, new: true }
    );

    return {
      ...data,
      cachedAt: now,
    };
  } catch (error) {
    console.error('❌ [Analytics] Failed to get or compute learning analytics:', error);
    
    // Attempt to return expired cache if computation fails (fail-safe recovery)
    const cached = await AnalyticsCache.findOne({ key: 'learning_analytics' });
    if (cached) {
      console.warn('⚠️ [Analytics] Returning expired cache as fallback due to aggregation failure');
      return {
        ...cached.data,
        cachedAt: cached.updatedAt,
      };
    }
    throw error;
  }
};
