import axios from 'axios';
import { User } from '../model/user.model.js'; 
import { Profile } from '../model/profile.model.js';

export async function recommendMeal(req, res) {
    try {
        const user = await User.findById(req.user._id).populate('profile'); 
        if (!user || !user.profile) {
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }

        const { calorieGoal, fitnessGoal } = user.profile.goals;
        const { diet } = user.profile;
        
        if (!calorieGoal || !diet) {
            return res.status(400).json({ success: false, message: 'User nutritional data missing in profile.' });
        }

        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        let mealType;
        let caloriePercentage;

        if (currentHour >= 5 && currentHour <= 10) {
            mealType = 'breakfast';
            caloriePercentage = 0.25;
        } else if (currentHour >= 11 && currentHour <= 16) {
            mealType = 'lunch';
            caloriePercentage = 0.32;
        } else if (currentHour >= 17 && currentHour <= 21) {
            mealType = 'snack';
            caloriePercentage = 0.12;
        } else {
            mealType = 'dinner';
            caloriePercentage = 0.28;
        }

        const mealCalories = calorieGoal * caloriePercentage;

        let spoonacularDiet;
        switch (diet) {
            case 'Veg':
                spoonacularDiet = 'vegetarian';
                break;
            case 'Vegan':
                spoonacularDiet = 'vegan';
                break;
            case 'Non-Vegetarian':
                spoonacularDiet = '';  
                break;
            case 'Gluten Free':
                spoonacularDiet = 'gluten free';
                break;
            default:
                spoonacularDiet = ''; 
        }

        const params = {
            apiKey: process.env.SPOONACULAR_API_KEY,
            type: mealType,
            minCalories: mealCalories * 0.8,
            maxCalories: mealCalories * 1.2,
            number: 5
        };

        if (spoonacularDiet) {
            params.diet = spoonacularDiet;
        }

        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', { params });

        const meals = response.data.results.map(meal => ({
            name: meal.title,
            description: `A healthy ${mealType} option that fits your dietary preferences.`,
            calories: meal.calories || Math.round(mealCalories),
            protein: Math.round(mealCalories * 0.3 / 4), 
            image: meal.image
        }));

        const workouts = generateWorkoutSuggestions(fitnessGoal);

        const tips = generateHealthTips(fitnessGoal, diet);

        res.status(200).json({
            success: true,
            message: `Recommended ${mealType} for you!`,
            suggestions: {
                meals,
                workouts,
                tips
            }
        });

    } catch (error) {
        console.error('Error fetching meal recommendation:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

function generateWorkoutSuggestions(fitnessGoal) {
    const workouts = {
        'Weight Loss': [
            {
                name: 'High-Intensity Interval Training (HIIT)',
                description: '30-second bursts of intense exercise followed by 1-minute rest periods.',
                duration: 30,
                caloriesBurned: 400
            },
            {
                name: 'Cardio Circuit',
                description: 'Combination of running, jumping rope, and burpees.',
                duration: 45,
                caloriesBurned: 500
            }
        ],
        'Weight Gain': [
            {
                name: 'Strength Training',
                description: 'Focus on compound exercises with progressive overload.',
                duration: 60,
                caloriesBurned: 300
            },
            {
                name: 'Resistance Training',
                description: 'Heavy weights with fewer repetitions to build muscle mass.',
                duration: 45,
                caloriesBurned: 250
            }
        ],
        'Muscle Building': [
            {
                name: 'Progressive Overload Training',
                description: 'Gradually increasing weight and intensity to build muscle.',
                duration: 60,
                caloriesBurned: 350
            },
            {
                name: 'Compound Exercise Circuit',
                description: 'Focus on multi-joint movements for maximum muscle engagement.',
                duration: 45,
                caloriesBurned: 300
            }
        ],
        'Maintenance': [
            {
                name: 'Balanced Workout',
                description: 'Mix of cardio and strength training to maintain fitness.',
                duration: 45,
                caloriesBurned: 350
            },
            {
                name: 'Flexibility and Strength',
                description: 'Combination of yoga and light strength training.',
                duration: 40,
                caloriesBurned: 250
            }
        ]
    };

    return workouts[fitnessGoal] || workouts['Maintenance'];
}

function generateHealthTips(fitnessGoal, diet) {
    const tips = {
        'Weight Loss': [
            'Stay hydrated throughout the day to support metabolism.',
            'Include protein-rich foods to maintain muscle mass while losing fat.',
            'Get adequate sleep to support weight loss efforts.',
            'Practice portion control and mindful eating.'
        ],
        'Weight Gain': [
            'Focus on nutrient-dense foods rather than empty calories.',
            'Eat frequent, smaller meals throughout the day.',
            'Include healthy fats in your diet.',
            'Combine proper nutrition with strength training.'
        ],
        'Muscle Building': [
            'Ensure adequate protein intake for muscle recovery.',
            'Get enough rest between workouts.',
            'Stay consistent with your training routine.',
            'Track your progress and adjust your routine accordingly.'
        ],
        'Maintenance': [
            'Maintain a balanced diet with all food groups.',
            'Stay active with regular exercise.',
            'Listen to your body\'s hunger and fullness cues.',
            'Keep track of your health metrics regularly.'
        ]
    };

    const dietSpecificTips = {
        'Veg': 'Include plant-based protein sources like legumes and tofu.',
        'Vegan': 'Ensure adequate B12 and iron intake through fortified foods.',
        'Non-Vegetarian': 'Choose lean protein sources and include plenty of vegetables.',
        'Gluten Free': 'Focus on naturally gluten-free whole grains and vegetables.'
    };

    return [...(tips[fitnessGoal] || tips['Maintenance']), dietSpecificTips[diet]];
}
