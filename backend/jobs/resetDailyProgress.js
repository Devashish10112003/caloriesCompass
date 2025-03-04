import { Profile } from "../model/profile.model.js";
import { Meal } from "../model/meal.model.js";

async function resetDailyProgress(){
    
    try {
        await Profile.updateMany({}, {
            $set: {
                "dailyProgress.totalCalories": 0,
                "dailyProgress.totalProtein": 0,
                "dailyProgress.totalCarbs": 0,
                "dailyProgress.totalFats": 0,
                "dailyProgress.lastUpdated": new Date()
            }
        });
        console.log("Daily progress reset at midnight");
    } catch (error) {
        console.error("Error resetting daily progress:", error);
    }


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
}


export default resetDailyProgress;