import express from 'express';
import { getLeaderboard, getCuratedRepos, addCuratedRepo, getTrendingRepos, getRepoReadme, getRepoSetupGuide, searchRepos, searchIssues, getReposById } from '../controllers/opensource.controller';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/repos', getCuratedRepos);
router.post('/repos', addCuratedRepo);
router.get('/repos/:owner/:repo/readme', getRepoReadme);
router.get('/repos/:owner/:repo/setup-guide', getRepoSetupGuide);
router.get('/trending', getTrendingRepos);
router.get('/search', searchRepos);
router.get('/issues', searchIssues);
router.get('/by-id', getReposById);

export default router;
