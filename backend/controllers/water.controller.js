import {WaterLog} from "../model/water.model.js";

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

        const totalWaterIntake = dailyWaterLogs.reduce((total, log) => total + log.amount, 0);

        res.status(200).json({
            success: true,
            totalWaterIntake, 
            dailyWaterLogs 
        });

    } catch (error) {
        console.error('Error fetching daily water intake:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

