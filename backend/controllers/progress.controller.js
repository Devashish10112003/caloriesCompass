import { Profile } from "../model/profile.model.js";

export async function getDailyProgress(req, res) {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const profile = await Profile.findOne({ user: req.user._id }, "dailyProgress goals");

        if (!profile) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        res.status(200).json({ success: true, dailyProgress: profile.dailyProgress, goals:profile.goals });

    } catch (error) {
        console.error("Error fetching daily progress:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

//maybe also send the goal calories too