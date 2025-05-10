import express from "express";
import { logMeal, getMeals, getMealById, updateMeal, deleteMeal } from "../controllers/meal.controller.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/meals';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to log a meal with image upload
router.post('/log', upload.single('image'), logMeal);

// Get all meals for today
router.get('/today', getMeals);

// Get a specific meal by ID
router.get('/:id', getMealById);

// Update a meal
router.put('/:id', updateMeal);

// Delete a meal
router.delete('/:id', deleteMeal);

export default router;
