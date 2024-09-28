import express from "express";
const { logMeal } = require('../controllers/meal.controller');
const router = express.Router();

// Route to log a meal (protected by authentication)
router.post('/log', logMeal);

export default router;
