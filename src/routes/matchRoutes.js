import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { createMatch, listMatches, updateScore, upcoming, recent, completeMatch } from '../controllers/matchController.js';

const router = Router();

// public lists
router.get('/', listMatches);
router.get('/upcoming', upcoming);
router.get('/recent', recent);

// admin
router.post('/', requireAdmin, createMatch);
router.put('/:id/score', requireAdmin, updateScore);
router.put('/:id/complete', requireAdmin, completeMatch);

export default router;
