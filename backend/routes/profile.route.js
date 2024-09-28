import express from "express";
import { updateUserProfile } from "../controllers/profile.controller.js";

const router = express.Router();

// Update User Profile Route - Protected by Authentication Middleware
router.post('/update', updateUserProfile);

export default router;
