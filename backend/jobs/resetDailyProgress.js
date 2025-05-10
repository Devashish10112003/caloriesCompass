import { Profile } from "../model/profile.model.js";

export async function resetDailyProgress(){
    
    try {
        await Profile.updateMany({}, {
            $set: {
                "dailyProgress.totalCalories": 0,
                "dailyProgress.totalProtein": 0,
                "dailyProgress.totalCarbs": 0,
                "dailyProgress.totalFats": 0,
                "dailyProgress.totalWater": 0,
                "dailyProgress.lastUpdated": new Date()
            }
        });
        console.log("Daily progress reset at midnight");
    } catch (error) {
        console.error("Error resetting daily progress:", error);
    }
}
