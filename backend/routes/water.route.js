import express from "express";
import {logWater,getDailyWaterIntake} from "../controllers/water.controller.js";

const router = express.Router();

// Route to log water intake (protected by authentication)
router.post('/log', logWater);

router.get('/getDailyWaterIntake', getDailyWaterIntake);

export default router;
