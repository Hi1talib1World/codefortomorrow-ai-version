export interface XpCalculationResult {
  baseReward: number;
  multiplier: number;
  finalXp: number;
  isAlreadyCompleted: boolean;
}

/**
 * Calculates XP reward according to platform rules
 * - Standard Lesson: 10 XP base
 * - Quiz: 5 XP base
 * - Re-completing already completed lesson: flat 5 XP
 * - Streak Multiplier: x1.2 for 3+ days, x1.5 for 5+ days
 */
export const calculateXpReward = (
  lessonType: string,
  nodeType: string,
  isAlreadyCompleted: boolean,
  streak: number
): XpCalculationResult => {
  const isQuiz = lessonType === 'quiz' || nodeType === 'quiz';
  const baseReward = isQuiz ? 5 : 10;
  const multiplier = streak >= 5 ? 1.5 : (streak >= 3 ? 1.2 : 1.0);
  const finalXp = isAlreadyCompleted ? 5 : Math.round(baseReward * multiplier);
  
  return {
    baseReward,
    multiplier,
    finalXp,
    isAlreadyCompleted,
  };
};
