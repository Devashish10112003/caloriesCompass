import express from "express";
import cron from "node-cron"
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import mealRoutes from "./routes/meal.route.js";
import waterRoutes from "./routes/water.route.js";
import profileRoutes from "./routes/profile.route.js";
import recommendationRoutes from "./routes/recommendation.route.js";
import progressRoutes from "./routes/progress.route.js";

import { connectDB } from "./config/db.js";
import { ENV_VARS } from "./config/envVars.js";
import {protectRoute} from "./middleware/protectRoute.js";
import {resetDailyProgress} from "./jobs/resetDailyProgress.js";


const app=express();
const PORT = ENV_VARS.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/meal',protectRoute, mealRoutes);
app.use('/api/water',protectRoute,waterRoutes);
app.use('/api/progress',protectRoute,progressRoutes);
app.use('/api/profile',protectRoute ,profileRoutes);
app.use('/api/recommend-meal',protectRoute,recommendationRoutes);


cron.schedule('0 0 * * *', resetDailyProgress);



app.listen(PORT,()=>{
    console.log("server started running at https://localhost:"+PORT);
    connectDB();
});

//maybe add track record so that user can see the last 7 days macros. but first make this functionalKO