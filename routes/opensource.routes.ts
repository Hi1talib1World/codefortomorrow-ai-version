import express from 'express';
import { getLeaderboard, getCuratedRepos, addCuratedRepo } from '../controllers/opensource.controller';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/repos', getCuratedRepos);
router.post('/repos', addCuratedRepo);

export default router;
