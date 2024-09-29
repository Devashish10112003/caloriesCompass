import express from 'express';
import { recommendMeal } from '../controllers/recommendation.controller.js';

const router = express.Router();

// Route to recommend meals
router.get('/', recommendMeal);

export default router;
