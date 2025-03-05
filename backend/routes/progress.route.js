import express from "express";
import {getDailyProgress} from "../controllers/progress.controller.js";

const router=express.Router();

router.get("/getDailyProgress",getDailyProgress);

export default router;