import express from 'express';
import { getLeaderboard, getCuratedRepos, addCuratedRepo, getTrendingRepos, getRepoReadme } from '../controllers/opensource.controller';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/repos', getCuratedRepos);
router.post('/repos', addCuratedRepo);
router.get('/repos/:owner/:repo/readme', getRepoReadme);
router.get('/trending', getTrendingRepos);

export default router;
