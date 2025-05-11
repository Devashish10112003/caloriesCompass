import { Profile } from "../model/profile.model.js";

export async function getDailyProgress(req, res) {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if lastUpdated is before today
        if (profile.dailyProgress.lastUpdated < today) {
            profile.dailyProgress = {
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFats: 0,
                totalWater: 0,
                lastUpdated: new Date()
            };

            await profile.save();
        }

        res.status(200).json({ 
            success: true, 
            dailyProgress: profile.dailyProgress, 
            goals: profile.goals 
        });

    } catch (error) {
        console.error("Error fetching daily progress:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
