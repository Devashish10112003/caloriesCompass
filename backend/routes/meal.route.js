import express from "express";
import { logMeal } from "../controllers/meal.controller.js";
const router = express.Router();

// Route to log a meal (protected by authentication)
router.post('/log', logMeal);

export default router;
