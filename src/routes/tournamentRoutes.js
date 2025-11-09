import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  createTournament,
  addTeamToTournament,
  generateFixtures,
  getAllTournaments,
} from "../controllers/tournamentController.js";
import { standings } from "../controllers/standingsController.js";

const router = Router();

// public routes
router.get("/", getAllTournaments); // List all tournaments
router.get("/:tournamentId/standings", standings);

// admin routes
router.post("/", requireAdmin, createTournament);
router.post("/:id/add-team", requireAdmin, addTeamToTournament);
router.post("/:id/generate-fixtures", requireAdmin, generateFixtures);

export default router;
