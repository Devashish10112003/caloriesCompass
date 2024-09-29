import {User} from "../model/user.model.js";
import { Profile } from "../model/profile.model.js";
import { calculateTDEE, calculateMacros } from "../utils/calculateMacros.js";

// Controller function to handle profile updates and goal calculation
export async function updateUserProfile(req, res) 
{
    try {
        const { height, weight, age, gender, activityLevel, fitnessGoal,diet } = req.body;

        // Ensure required fields are provided
        if (!height || !weight || !age || !gender || !activityLevel || !fitnessGoal || !diet) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        console.log("req.user:", req.user);

        // Find the user from the authenticated request
        const user = await User.findById(req.user._id).populate('profile');

        //console.log(user.profile);

        if (!user || !user.profile) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update user profile with the new data
        const profile = user.profile;  // Extract the profile object
        profile.height = height;
        profile.weight = weight;
        profile.age = age;
        profile.gender = gender;
        profile.activityLevel = activityLevel;
        profile.fitnessGoal=fitnessGoal;
        profile.diet=diet;

        // Calculate TDEE (Total Daily Energy Expenditure) and Macronutrient Goals
        const { tdee, calorieGoal } = calculateTDEE(height, weight, age, gender, activityLevel);
        const { proteinGoal, fatGoal, carbGoal, waterGoal } = calculateMacros(weight, height, age, gender, activityLevel, fitnessGoal);

        // Update user's caloric and macronutrient goals
        profile.tdee = tdee;
        profile.calorieGoal = calorieGoal;
        profile.proteinGoal = proteinGoal;
        profile.fatGoal = fatGoal;
        profile.carbGoal = carbGoal;
        profile.waterGoal = waterGoal;

        // Save the updated user profile to the database
        await profile.save();

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
