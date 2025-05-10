import {Meal} from "../model/meal.model.js";
import {Profile} from "../model/profile.model.js";
import axios from "axios";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/meals';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export async function logMeal(req, res) {
    try {
        const { mealName, portionSize } = req.body;
        let imagePath = null;

        if (req.file) {
            imagePath = req.file.path;
        }

        if (!mealName || !portionSize) {
            return res.status(400).json({ success: false, message: 'Please provide meal name and portion size.' });
        }

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

        const newMeal = new Meal({
            userId: req.user._id,
            mealName: mealName,
            calories: nf_calories,
            protein: nf_protein,
            carbs: nf_total_carbohydrate,
            fats: nf_total_fat,
            image: imagePath,
            dateLogged: new Date()
        });

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

export async function getMealById(req, res) {
    try {
        const mealId = req.params.id;
        const meal = await Meal.findOne({ 
            _id: mealId,
            userId: req.user._id 
        });

        if (!meal) {
            return res.status(404).json({ 
                success: false, 
                message: 'Meal not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Meal retrieved successfully',
            meal: meal
        });
    } catch (error) {
        console.error('Error getting meal by ID:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
}

export async function updateMeal(req, res) {
    try {
        const mealId = req.params.id;
        const { mealName, portionSize } = req.body;

        if (!mealName || !portionSize) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide meal name and portion size.' 
            });
        }

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

        const oldMeal = await Meal.findOne({ 
            _id: mealId,
            userId: req.user._id 
        });

        if (!oldMeal) {
            return res.status(404).json({ 
                success: false, 
                message: 'Meal not found' 
            });
        }

        const updatedMeal = await Meal.findByIdAndUpdate(
            mealId,
            {
                mealName,
                calories: nf_calories,
                protein: nf_protein,
                carbs: nf_total_carbohydrate,
                fats: nf_total_fat,
                dateLogged: new Date()
            },
            { new: true }
        );

        await Profile.findOneAndUpdate(
            { user: req.user._id },
            {
                $inc: {
                    "dailyProgress.totalCalories": (nf_calories - oldMeal.calories),
                    "dailyProgress.totalProtein": (nf_protein - oldMeal.protein),
                    "dailyProgress.totalCarbs": (nf_total_carbohydrate - oldMeal.carbs),
                    "dailyProgress.totalFats": (nf_total_fat - oldMeal.fats)
                },
                "dailyProgress.lastUpdated": new Date()
            }
        );

        res.status(200).json({
            success: true,
            message: 'Meal updated successfully',
            meal: updatedMeal
        });
    } catch (error) {
        console.error('Error updating meal:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
}

export async function deleteMeal(req, res) {
    try {
        const mealId = req.params.id;
        
        const meal = await Meal.findOne({ 
            _id: mealId,
            userId: req.user._id 
        });

        if (!meal) {
            return res.status(404).json({ 
                success: false, 
                message: 'Meal not found' 
            });
        }

        await Meal.findByIdAndDelete(mealId);

        await Profile.findOneAndUpdate(
            { user: req.user._id },
            {
                $inc: {
                    "dailyProgress.totalCalories": -meal.calories,
                    "dailyProgress.totalProtein": -meal.protein,
                    "dailyProgress.totalCarbs": -meal.carbs,
                    "dailyProgress.totalFats": -meal.fats
                },
                "dailyProgress.lastUpdated": new Date()
            }
        );

        res.status(200).json({
            success: true,
            message: 'Meal deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting meal:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
}

//have to add the frontend for the modified routes