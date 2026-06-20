import { createNotification } from '../../realtime/sse';

const totalMap: Record<string, number> = {
  block_coding: 15,
  python: 15,
  javascript: 15,
  math: 15,
  web_dev: 15,
  typescript: 15,
  lua: 15,
};

/**
 * Calculates progress ratio for a specific path
 */
const calculateProgressForPath = (pathId: string, completedLessons: any, skillMastery: any) => {
  const totalLessons = totalMap[pathId] || 15;
  
  let completedCount = 0;
  if (completedLessons) {
    if (typeof completedLessons.get === 'function') {
      const list = completedLessons.get(pathId);
      completedCount = Array.isArray(list) ? list.length : 0;
    } else if (completedLessons[pathId]) {
      const list = completedLessons[pathId];
      completedCount = Array.isArray(list) ? list.length : 0;
    }
  }
  
  let proficiency = 0.0;
  if (skillMastery) {
    if (typeof skillMastery.get === 'function') {
      const masteryVal = skillMastery.get(pathId);
      if (masteryVal) {
        proficiency = masteryVal / 100;
      }
    } else if (skillMastery[pathId]) {
      const masteryVal = skillMastery[pathId];
      if (masteryVal) {
        proficiency = masteryVal / 100;
      }
    }
  }
  
  const completion_ratio = totalLessons > 0 ? (completedCount / totalLessons) : 0.0;
  return (proficiency * 70) + (completion_ratio * 30);
};

/**
 * Validates progress updates to see if new pathways were unlocked.
 */
export const checkPathUnlocks = async (
  userId: string,
  oldCompleted: any,
  oldMastery: any,
  newCompleted: any,
  newMastery: any
) => {
  try {
    const blockCodingBefore = calculateProgressForPath('block_coding', oldCompleted, oldMastery);
    const jsBefore = calculateProgressForPath('javascript', oldCompleted, oldMastery);

    const blockCodingAfter = calculateProgressForPath('block_coding', newCompleted, newMastery);
    const jsAfter = calculateProgressForPath('javascript', newCompleted, newMastery);

    // Path unlocks: block_coding >= 30% unlocks python & javascript
    if (blockCodingBefore < 30 && blockCodingAfter >= 30) {
      await createNotification(
        userId,
        'Courses Unlocked! ',
        'Congratulations! Your Block Coding progress reached 30%. Python and JavaScript pathways are now unlocked!',
        'course_unlocked'
      );
    }
    // javascript >= 30% unlocks web_dev, typescript, lua
    if (jsBefore < 30 && jsAfter >= 30) {
      await createNotification(
        userId,
        'New Courses Unlocked! ',
        'Congratulations! Your JavaScript progress reached 30%. Web Development, TypeScript, and Lua pathways are now unlocked!',
        'course_unlocked'
      );
    }
    // javascript >= 40% unlocks C++, Java, Kotlin, Swift, Go, Rust, etc.
    if (jsBefore < 40 && jsAfter >= 40) {
      await createNotification(
        userId,
        'Advanced Paths Unlocked! ',
        'Incredible! Your JavaScript progress reached 40%. Advanced coding tracks (C++, Java, Kotlin, Swift, Go, Rust) are now unlocked!',
        'course_unlocked'
      );
    }
  } catch (error) {
    console.error('Error executing course unlock check:', error);
  }
};
