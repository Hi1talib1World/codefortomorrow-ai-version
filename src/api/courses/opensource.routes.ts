import express from 'express';
import { getLeaderboard, getCuratedRepos, addCuratedRepo, getTrendingRepos, getRepoReadme, getRepoSetupGuide, searchRepos, searchIssues, getReposById, translateText } from './opensource.controller';
import { protect } from '../../../src/core/permissions/auth.middleware';
import { adminOnly } from '../../../src/core/permissions/admin.middleware';

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
router.post('/translate', translateText);

export default router;
