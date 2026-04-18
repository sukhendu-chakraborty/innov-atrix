import { Router } from "express";
import { getBountyMatches } from "../controllers/ai.controller.js";

const router = Router();

router.get("/match/:bountyId", getBountyMatches);

export default router;
