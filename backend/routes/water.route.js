import express from "express";
import {logWater} from "../controllers/water.controller.js";

const router = express.Router();

// Route to log water intake (protected by authentication)
router.post('/log', logWater);

export default router;
