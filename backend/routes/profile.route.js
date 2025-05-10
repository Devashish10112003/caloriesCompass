import express from "express";
import { updateUserProfile, getUserProfile } from "../controllers/profile.controller.js";

const router = express.Router();

// Update User Profile Route - Protected by Authentication Middleware
router.put('/', updateUserProfile);

router.get('/', getUserProfile);

export default router;
