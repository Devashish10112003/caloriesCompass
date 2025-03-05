import {Meal} from "../model/meal.model.js";
import {Profile} from "../model/profile.model.js";
import axios from "axios";

// Controller to log a meal
export async function logMeal(req, res) {
    try {
        const { mealName, portionSize} = req.body;

        if (!mealName || !portionSize) {
            return res.status(400).json({ success: false, message: 'Please provide meal name and portion size.' });
        }

        // Fetch nutritional data from Nutritionix API
        const response = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
            query: `${portionSize} ${mealName}`
        }, {
            headers: {
                'x-app-id': process.env.NUTRITIONIX_APP_ID,
                'x-app-key': process.env.NUTRITIONIX_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const foodData = response.data.foods[0];
        const { nf_calories, nf_protein, nf_total_carbohydrate, nf_total_fat } = foodData;

        // Create a new meal entry in the database
        const newMeal = new Meal({
            userId: req.user._id,
            mealName: mealName,
            calories: nf_calories,
            protein: nf_protein,
            carbs: nf_total_carbohydrate,
            fats: nf_total_fat,
            dateLogged: new Date()
        });

        // Save the meal to the database
        await newMeal.save();


        await Profile.findOneAndUpdate(
            { user:req.user._id },
            {
                $inc: {
                    "dailyProgress.totalCalories": nf_calories,
                    "dailyProgress.totalProtein": nf_protein,
                    "dailyProgress.totalCarbs": nf_total_carbohydrate,
                    "dailyProgress.totalFats": nf_total_fat
                },
                "dailyProgress.lastUpdated": new Date()
            }
        );

        
        res.status(201).json({
            success: true,
            message: 'Meal logged successfully!',
            meal: newMeal
        });
        
    } catch (error) {
        console.error('Error logging meal:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export async function getMeals(req,res){
    try{

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const meals=await Meal.find({ 
            userId:req.user._id ,
            dateLogged:  {$gte: today} 
        });
        
        res.status(200).json({
            success: true,
            message: 'Got meals successfully',
            meals:meals
        });
    }
    catch(error){
        console.log('Error getting all the meals: ',error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
