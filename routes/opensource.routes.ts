import express from 'express';
import { getLeaderboard, getCuratedRepos, addCuratedRepo, getTrendingRepos } from '../controllers/opensource.controller';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/repos', getCuratedRepos);
router.post('/repos', addCuratedRepo);
router.get('/trending', getTrendingRepos);

export default router;
