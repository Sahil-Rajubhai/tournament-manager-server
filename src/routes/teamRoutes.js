import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { listTeams, createTeam, updateTeam, deleteTeam, addPlayer, getTeam } from '../controllers/teamController.js';

const router = Router();

// public read
router.get('/', listTeams);
router.get('/:id', getTeam);

// admin write
router.post('/', requireAdmin, createTeam);
router.put('/:id', requireAdmin, updateTeam);
router.delete('/:id', requireAdmin, deleteTeam);
router.post('/:id/players', requireAdmin, addPlayer);

export default router;
