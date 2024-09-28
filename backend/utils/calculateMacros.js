// Helper function to calculate TDEE based on user profile
export const calculateTDEE = (height, weight, age, gender, activityLevel) => {
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let activityMultiplier;
    switch (activityLevel) {
        case 'sedentary':
            activityMultiplier = 1.2;
            break;
        case 'lightly_active':
            activityMultiplier = 1.375;
            break;
        case 'moderately_active':
            activityMultiplier = 1.55;
            break;
        case 'very_active':
            activityMultiplier = 1.725;
            break;
        default:
            activityMultiplier = 1.2;
    }

    const tdee = bmr * activityMultiplier;
    const calorieGoal = tdee; // Can adjust for weight loss, weight gain, etc.

    return { tdee, calorieGoal };
};

// Helper function to calculate macronutrients (protein, fats, carbs) and water intake
export const calculateMacros = (weight, height, age, gender, activityLevel, fitnessGoal) => {
    const { tdee, calorieGoal } = calculateTDEE(height, weight, age, gender, activityLevel);

    let proteinPerKg;
    let fatPercentage;
    let carbPercentage;

    switch (fitnessGoal) {
        case 'weight_loss':
            proteinPerKg = 1.5;
            fatPercentage = 0.25;
            carbPercentage = 0.45;
            break;
        case 'weight_gain':
            proteinPerKg = 1.6;
            fatPercentage = 0.30;
            carbPercentage = 0.50;
            break;
        case 'muscle_building':
            proteinPerKg = 2.0;
            fatPercentage = 0.25;
            carbPercentage = 0.50;
            break;
        default:
            proteinPerKg = 1.5;
            fatPercentage = 0.25;
            carbPercentage = 0.50;
    }

    const proteinGoal = weight * proteinPerKg;
    const fatGoal = (calorieGoal * fatPercentage) / 9;
    const carbGoal = (calorieGoal * carbPercentage) / 4;

    const waterGoal = weight * 35;

    return {
        proteinGoal: Math.round(proteinGoal),
        fatGoal: Math.round(fatGoal),
        carbGoal: Math.round(carbGoal),
        waterGoal: Math.round(waterGoal)
    };
};



