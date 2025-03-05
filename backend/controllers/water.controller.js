import {WaterLog} from "../model/water.model.js";
import {Profile} from "../model/profile.model.js";


export async function logWater(req, res) {
    try {
        const { amount } = req.body;  

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Please provide the amount of water.' });
        }

        const newWaterLog = new WaterLog({
            userId: req.user._id,
            amount: amount
        });

        await newWaterLog.save();

        await Profile.findOneAndUpdate(
            { user:req.user._id },
            {
                $inc: {
                    "dailyProgress.totalWater":amount
                },
                "dailyProgress.lastUpdated": new Date()
            }
        );

        res.status(201).json({
            success: true,
            message: 'Water intake logged successfully!',
            waterLog: newWaterLog
        });

    } catch (error) {
        console.error('Error logging water intake:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export async function getDailyWaterIntake(req, res){
    try {
        const userId = req.user._id; 

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dailyWaterLogs = await WaterLog.find({
            userId: userId,
            dateLogged: { $gte: today }
        });

        
        res.status(200).json({
            success: true,
            dailyWaterLogs :dailyWaterLogs
        });

    } 
    catch (error) {
        console.error('Error fetching daily water intake:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

