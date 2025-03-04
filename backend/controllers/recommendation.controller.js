import axios from 'axios';
import { User } from '../model/user.model.js'; 
import { Profile } from '../model/profile.model.js';

export async function recommendMeal(req, res) {
    try {
        const user = await User.findById(req.user._id).populate('profile'); 
        if (!user || !user.profile) {
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }

        const { calorieGoal, proteinGoal, fatGoal, carbGoal } = user.profile.goals;
        const{diet}=user.profile;
        
        if (!calorieGoal || !proteinGoal || !fatGoal || !carbGoal || !diet) {
            return res.status(400).json({ success: false, message: 'User nutritional data missing in profile.' });
        }

        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        let mealType;
        let caloriePercentage;

        if (currentHour >= 5 && currentHour <= 10) {
            mealType = 'breakfast';
            caloriePercentage = 0.25; // 25-30% of daily calories for breakfast
        } else if (currentHour >= 11 && currentHour <= 14) {
            mealType = 'lunch';
            caloriePercentage = 0.32; // 30-35% for lunch
        } else if (currentHour >= 15 && currentHour <= 17) {
            mealType = 'snack';
            caloriePercentage = 0.12; // 10-15% for snacks
        } else if (currentHour >= 18 && currentHour <= 21) {
            mealType = 'dinner';
            caloriePercentage = 0.28; // 25-30% for dinner
        } else {
            return res.status(400).json({ success: false, message: 'No meal suggestions at this time.' });
        }

        const mealCalories = calorieGoal * caloriePercentage;
        const mealProtein = proteinGoal * caloriePercentage;
        const mealFat = fatGoal * caloriePercentage;
        const mealCarbs = carbGoal * caloriePercentage;

        let spoonacularDiet;
        switch (diet) {
            case 'veg':
                spoonacularDiet = 'vegetarian';
                break;
            case 'vegan':
                spoonacularDiet = 'vegan';
                break;
            case 'nonveg':
                spoonacularDiet = '';  // No specific diet parameter for nonveg
                break;
            case 'gluten free':
                spoonacularDiet = 'gluten free';
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid diet type' });
        }

        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
            params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                diet: spoonacularDiet,
                type: mealType,          // breakfast, lunch, snack, or dinner
                minCalories: mealCalories * 0.9, 
                maxCalories: mealCalories * 1.1,
                number: 5,  // Return 5 recommended meals
                minProtein: mealProtein * 0.9,
                minFat: mealFat * 0.9,
                minCarbs: mealCarbs * 0.9
            }
        });


        const meals = response.data.results;

        if (!meals.length) {
            return res.status(404).json({ success: false, message: 'No meal found for your preferences.' });
        }

        res.status(200).json({
            success: true,
            message: `Recommended ${mealType} for you!`,
            meals: meals  
        });

    } catch (error) {
        console.error('Error fetching meal recommendation:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
