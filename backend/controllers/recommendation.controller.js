import axios from 'axios';
import { User } from '../model/user.model.js'; // Adjust the path if your model is in a different location
import { Profile } from '../model/profile.model.js';

// Function to recommend meals based on user's profile
export async function recommendMeal(req, res) {
    try {
        // Fetch the user from the database to get the profile data
        const user = await User.findById(req.user._id).populate('profile');  // Assuming profile is populated in User

        if (!user || !user.profile) {
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }

        // Extract the relevant goal data from the user's profile
        const { calorieGoal, proteinGoal, fatGoal, carbGoal, diet } = user.profile;

        if (!calorieGoal || !proteinGoal || !fatGoal || !carbGoal || !diet) {
            return res.status(400).json({ success: false, message: 'User nutritional data missing in profile.' });
        }

        // Determine the time of day to recommend a meal
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        let mealType;
        let caloriePercentage;

        // Meal time logic (decides meal type and percentage of daily calories for that meal)
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

        // Calculate the recommended calories and macronutrients for this meal
        const mealCalories = calorieGoal * caloriePercentage;
        const mealProtein = proteinGoal * caloriePercentage;
        const mealFat = fatGoal * caloriePercentage;
        const mealCarbs = carbGoal * caloriePercentage;

        // Map user diet to Spoonacular diet parameters
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

        // Fetch meal recommendation from Spoonacular API for 5 meals
        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
            params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                diet: spoonacularDiet,
                type: mealType,          // breakfast, lunch, snack, or dinner
                minCalories: mealCalories * 0.9, // Allow some flexibility, 90% to 110% of calculated calories
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

        // Send the 5 recommended meals
        res.status(200).json({
            success: true,
            message: `Recommended ${mealType} for you!`,
            meals: meals  // Return an array of the 5 recommended meals
        });

    } catch (error) {
        console.error('Error fetching meal recommendation:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
