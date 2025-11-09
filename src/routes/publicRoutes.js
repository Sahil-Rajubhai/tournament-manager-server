import { Router } from "express";
import { upcoming, recent, live } from "../controllers/matchController.js";
import { standings } from "../controllers/standingsController.js";

const router = Router();

// Dashboard-like endpoints
router.get("/upcoming", upcoming);
router.get("/live", live);
router.get("/recent", recent);
// standings needs tournamentId
router.get("/tournaments/:tournamentId/standings", standings);

export default router;
