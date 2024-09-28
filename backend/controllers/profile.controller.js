import {User} from "../model/user.model.js"
import { calculateTDEE, calculateMacros } from "../utils/calculateMacros.js";

// Controller function to handle profile updates and goal calculation
export async function updateUserProfile(req, res) 
{
    try {
        const { height, weight, age, gender, activityLevel, fitnessGoal } = req.body;

        // Ensure required fields are provided
        if (!height || !weight || !age || !gender || !activityLevel || !fitnessGoal) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Find the user from the authenticated request
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update user profile with the new data
        user.height = height;
        user.weight = weight;
        user.age = age;
        user.gender = gender;
        user.activityLevel = activityLevel;

        // Calculate TDEE (Total Daily Energy Expenditure) and Macronutrient Goals
        const { tdee, calorieGoal } = calculateTDEE(height, weight, age, gender, activityLevel);
        const { proteinGoal, fatGoal, carbGoal, waterGoal } = calculateMacros(weight, height, age, gender, activityLevel, fitnessGoal);

        // Update user's caloric and macronutrient goals
        user.tdee = tdee;
        user.calorieGoal = calorieGoal;
        user.proteinGoal = proteinGoal;
        user.fatGoal = fatGoal;
        user.carbGoal = carbGoal;
        user.waterGoal = waterGoal;

        // Save the updated user profile to the database
        await user.save();

        // Return the updated user profile (excluding password)
        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: '', // Don't send the password in the response
            }
        });
    } catch (error) {
        console.log('Error updating profile', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
