import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    height: {
        type: Number,  
        required: false 
    },
    weight: {
        type: Number,  
        required: false 
    },
    age: {
        type: Number,
        required: false 
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: false 
    },
    activityLevel: { 
        type: String, 
        enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'], 
        default: 'Sedentary'
    },
    fitnessGoal: {
        type: String,
        enum: ['Weight Loss', 'Weight Gain', 'Muscle Building', 'Maintenance'], 
        required: false
    },
    diet: {
        type: String,
        enum: ['Veg', 'Vegan', 'Non-Vegetarian', 'Gluten Free'], 
        required: false
    },
    
    goals: {
        calorieGoal: { type: Number, required: true },
        proteinGoal: { type: Number, required: true },
        carbGoal: { type: Number, required: true },
        fatGoal: { type: Number, required: true },
        waterGoal: { type: Number, default: 4000 }, 
        tdee: { type: Number, default: 0 }
    },

    dailyProgress: {
        totalCalories: { type: Number, default: 0 },
        totalProtein: { type: Number, default: 0 },
        totalCarbs: { type: Number, default: 0 },
        totalFats: { type: Number, default: 0 },
        totalWater: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: new Date() }
    }
});

export const Profile = mongoose.model('Profile', profileSchema);
