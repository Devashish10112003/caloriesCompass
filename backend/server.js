import express from "express";
import cron from "node-cron"
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import mealRoutes from "./routes/meal.route.js"
import waterRoutes from "./routes/water.route.js"
import profileRoutes from "./routes/profile.route.js"

import { connectDB } from "./config/db.js";
import { ENV_VARS } from "./config/envVars.js";
import {protectRoute} from "./middleware/protectRoute.js";


const app=express();
const PORT = ENV_VARS.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/meal',protectRoute, mealRoutes);
app.use('/api/water',protectRoute,waterRoutes);
app.use('/api/profile',protectRoute ,profileRoutes);


cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Midnight of today

        // Delete meals from the previous day
        await Meal.deleteMany({
            dateLogged: { $lt: today }  // Delete all meals before today
        });

        console.log('Meals from the previous day have been deleted.');
    } catch (error) {
        console.error('Error in cron job for deleting meals:', error.message);
    }
});



app.listen(PORT,()=>{
    console.log("server started running at https://localhost:"+PORT);
    connectDB();
});