import express from "express";
import {getDailyProgress} from "../controllers/profile.controller.js";

const router=express.Router();

router.get("/get-daily-progress",getDailyProgress);

export default router;