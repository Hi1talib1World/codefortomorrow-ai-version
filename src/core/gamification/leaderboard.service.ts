import User from '../models/user.model';
import Progress from '../models/progress.model';
import { createNotification } from './notification.service';

/**
 * Checks for leaderboard ranking updates and triggers Climb or Drop notifications.
 */
export const handleLeaderboardRankCheck = async (
  userId: string,
  progressId: string,
  xpOld: number,
  xpNew: number
) => {
  try {
    if (xpNew <= xpOld) return;

    // 1. Calculate ranks before and after
    const rankBefore = await Progress.countDocuments({ xp: { $gt: xpOld } }) + 1;
    const rankAfter = await Progress.countDocuments({ xp: { $gt: xpNew } }) + 1;

    if (rankAfter < rankBefore) {
      await createNotification(
        userId,
        'Rank Up! 🏆',
        `Congratulations! You climbed to Rank #${rankAfter} on the global leaderboard.`,
        'leaderboard_rank_change'
      );
    }

    // 2. Identify passed users whose progress XP was overtaken
    const passedProgresses = await Progress.find({
      _id: { $ne: progressId },
      xp: { $gte: xpOld, $lt: xpNew }
    });

    if (passedProgresses.length > 0) {
      const passedProgressIds = passedProgresses.map(p => p._id);
      const passedUsers = await User.find({ progress: { $in: passedProgressIds } });

      for (const passedUser of passedUsers) {
        const opponentProg = passedProgresses.find(p => p._id.toString() === passedUser.progress.toString());
        if (opponentProg) {
          const opponentNewRank = await Progress.countDocuments({ xp: { $gt: opponentProg.xp } }) + 1;
          
          await createNotification(
            passedUser._id.toString(),
            'Leaderboard Update ⚠️',
            `Another student just passed you! You are now Rank #${opponentNewRank}. Do a lesson to catch up!`,
            'leaderboard_rank_change'
          );
        }
      }
    }

    // Update user's progress lastLeaderboardRank atomically
    await Progress.findByIdAndUpdate(progressId, { lastLeaderboardRank: rankAfter });
  } catch (error) {
    console.error('Error executing leaderboard rank check:', error);
  }
};
