import {WaterLog} from "../model/water.model.js";

// Controller to log water intake
export async function logWater(req, res) {
    try {
        const { amount } = req.body;  // Expected water amount in milliliters

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Please provide the amount of water.' });
        }

        // Create a new water entry in the database
        const newWaterLog = new WaterLog({
            userId: req.user._id,
            amount: amount
        });

        // Save the water entry to the database
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

// Function to get total water intake for the day
export const getDailyWaterIntake = async (req, res) => {
    try {
        const userId = req.user._id;  // Get the authenticated user's ID

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight

        // Find all water logs for today by the user
        const dailyWaterLogs = await WaterLog.find({
            userId: userId,
            dateLogged: { $gte: today }
        });

        // Calculate total water intake
        const totalWaterIntake = dailyWaterLogs.reduce((total, log) => total + log.amount, 0);

        res.status(200).json({
            success: true,
            totalWaterIntake, // Total amount of water drank today
            dailyWaterLogs // Optional: Return the individual logs if needed
        });

    } catch (error) {
        console.error('Error fetching daily water intake:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

