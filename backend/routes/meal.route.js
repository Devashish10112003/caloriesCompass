import express from "express";
import { logMeal,getMeals } from "../controllers/meal.controller.js";
const router = express.Router();

// Route to log a meal (protected by authentication)
router.post('/log', logMeal);
router.get('/getMeals',getMeals);

export default router;
