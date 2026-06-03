
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
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
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                {
                    name: req.body.name,
                    profilePictureUrl: req.body.profilePictureUrl,
                    coverPictureUrl: req.body.coverPictureUrl,
                    bio: req.body.bio,
                    currentPath: req.body.currentPath,
                    githubUrl: req.body.githubUrl,
                    linkedinUrl: req.body.linkedinUrl,
                    websiteUrl: req.body.websiteUrl,
                    professionalTitle: req.body.professionalTitle,
                    skills: req.body.skills,
                },
                { returnDocument: 'after', runValidators: true }
            ).select('-password');

            if (!updatedUser) {
                throw new ApiError(404, 'User not found');
            }

            await updatedUser.populate('progress');
            return res.json(updatedUser);

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

/**
 * @desc    Toggle saving a repository or blog post
 * @route   PUT /api/users/save
 * @access  Private
 */
export const toggleSaveItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = await User.findById(req.user?.id);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const { itemId, type } = req.body;
        if (!itemId || !['repo', 'post'].includes(type)) {
            throw new ApiError(400, 'Invalid request data');
        }

        if (type === 'repo') {
            const repos = user.savedRepos || [];
            if (repos.includes(itemId)) {
                user.savedRepos = repos.filter(id => id !== itemId);
            } else {
                user.savedRepos = [...repos, itemId];
            }
        } else if (type === 'post') {
            const posts = user.savedPosts || [];
            if (posts.includes(itemId)) {
                user.savedPosts = posts.filter(id => id !== itemId);
            } else {
                user.savedPosts = [...posts, itemId];
            }
        }

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
            savedRepos: updatedUser.savedRepos,
            savedPosts: updatedUser.savedPosts,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Search registered users by name
 * @route   GET /api/users/search
 * @access  Private
 */
export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = (req.query.q as string) || '';

        const isDbConnected = mongoose.connection.readyState === 1;
        if (!isDbConnected) {
            console.warn("⚠️ MongoDB is not connected. User search cannot proceed.");
            throw new ApiError(503, 'Service unavailable: database connection is required to search users.');
        }

        // @ts-ignore
        const currentUserId = req.user?.id || req.user?._id;
        // @ts-ignore
        const currentUserRole = req.user?.role || 'student';

        let queryObj: any = { _id: { $ne: currentUserId } };

        if (!query.trim()) {
            if (currentUserRole === 'student') {
                queryObj.role = { $in: ['teacher', 'admin'] };
            }
        } else {
            queryObj.name = { $regex: query, $options: 'i' };
            if (currentUserRole === 'student') {
                queryObj.role = { $in: ['teacher', 'admin'] };
            }
        }

        const users = await User.find(queryObj).select('name profilePictureUrl role bio').limit(50);
        res.json(users);
    } catch (error) {
        next(error);
    }
};
