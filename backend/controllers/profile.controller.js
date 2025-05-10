import {User} from "../model/user.model.js";
import { Profile } from "../model/profile.model.js";
import { calculateTDEE, calculateMacros } from "../utils/calculateMacros.js";

export async function getUserProfile(req, res) {
    try {
        const user = await User.findById(req.user._id).populate('profile');

        if (!user || !user.profile) {
            return res.status(404).json({ 
                success: false, 
                message: 'User profile not found' 
            });
        }

        const userData = {
            ...user._doc,
            password: undefined,
            profile: user.profile
        };

        res.status(200).json({
            success: true,
            user: userData
        });
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
}

export async function updateUserProfile(req, res) 
{
    try {
        const { height, weight, age, gender, activityLevel, fitnessGoal,diet } = req.body;

        if (!height || !weight || !age || !gender || !activityLevel || !fitnessGoal || !diet) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const user = await User.findById(req.user._id).populate('profile');


        if (!user || !user.profile) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const profile = user.profile;  
        profile.height = height;
        profile.weight = weight;
        profile.age = age;
        profile.gender = gender;
        profile.activityLevel = activityLevel;
        profile.fitnessGoal=fitnessGoal;
        profile.diet=diet;

        const { tdee, calorieGoal } = calculateTDEE(height, weight, age, gender, activityLevel);
        const { proteinGoal, fatGoal, carbGoal, waterGoal } = calculateMacros(weight, height, age, gender, activityLevel, fitnessGoal);

        profile.goals.tdee = tdee;
        profile.goals.calorieGoal = calorieGoal;
        profile.goals.proteinGoal = proteinGoal;
        profile.goals.fatGoal = fatGoal;
        profile.goals.carbGoal = carbGoal;
        profile.goals.waterGoal = waterGoal;

        await profile.save();

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                profile:profile,
                password: '',
            }
        });
    } catch (error) {
        console.log('Error updating profile', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
