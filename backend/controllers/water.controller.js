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
