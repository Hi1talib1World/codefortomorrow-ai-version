import express from 'express';
import { getLeaderboard, getCuratedRepos, addCuratedRepo, getTrendingRepos, getRepoReadme, getRepoSetupGuide, searchRepos, searchIssues, getReposById } from '../controllers/opensource.controller';
import { protect } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/admin.middleware';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/repos', getCuratedRepos);
router.post('/repos', protect, adminOnly, addCuratedRepo);
router.get('/repos/:owner/:repo/readme', getRepoReadme);
router.get('/repos/:owner/:repo/setup-guide', getRepoSetupGuide);
router.get('/trending', getTrendingRepos);
router.get('/search', searchRepos);
router.get('/issues', searchIssues);
router.get('/by-id', getReposById);

export default router;
