
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import Progress from '../models/progress.model';
import ApiError from '../utils/ApiError';

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
// Fix: Use Request, Response, NextFunction types from express to resolve property errors.
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = await User.findById(req.user?.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.profilePictureUrl = req.body.profilePictureUrl || user.profilePictureUrl;
            (user as any).bio = req.body.bio || (user as any).bio;
            (user as any).currentPath = req.body.currentPath || (user as any).currentPath;
            
            const updatedUser = await user.save();
            await updatedUser.populate('progress');
            
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profilePictureUrl: updatedUser.profilePictureUrl,
                bio: (updatedUser as any).bio,
                currentPath: (updatedUser as any).currentPath,
                progress: updatedUser.progress,
            });

        } else {
            throw new ApiError(404, 'User not found');
        }
    } catch (error) {
        next(error);
    }
};


/**
 * @desc    Update user's learning progress
 * @route   PUT /api/user/progress
 * @access  Private
 */
// Fix: Use Request, Response, NextFunction types from express to resolve property errors.
export const updateUserProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = await User.findById(req.user?.id);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        
        const progress = await Progress.findById(user.progress);
        
        if (progress) {
            progress.xp = req.body.xp ?? progress.xp;
            progress.streak = req.body.streak ?? progress.streak;
            progress.completedLessons = req.body.completedLessons ?? progress.completedLessons;
            progress.scores = req.body.scores ?? progress.scores;
            progress.badgesEarned = req.body.badgesEarned ?? progress.badgesEarned;
            progress.lastLessonCompletedDate = req.body.lastLessonCompletedDate ?? progress.lastLessonCompletedDate;
            
            // Adaptive Learning Updates
            if (req.body.skillMastery) {
                const newMastery = req.body.skillMastery;
                Object.keys(newMastery).forEach(concept => {
                    progress.skillMastery.set(concept, newMastery[concept]);
                });
            }

            // Gamification: Auto-unlock badges based on XP or mastery
            if (progress.xp > 1000 && !progress.badgesEarned.has('XP_MASTER')) {
                // Logic to add badge
            }
            
            const updatedProgress = await progress.save();
            res.json(updatedProgress);
        } else {
             throw new ApiError(404, 'Progress data not found for this user');
        }

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all teachers
 * @route   GET /api/users/teachers
 * @access  Private
 */
export const getTeachers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('name profilePictureUrl role bio');
        res.json(teachers);
    } catch (error) {
        next(error);
    }
};
