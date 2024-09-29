import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    height: {
        type: Number,  // in cm
        required: false // Make optional
    },
    weight: {
        type: Number,  // in kg
        required: false // Make optional
    },
    age: {
        type: Number,
        required: false // Make optional
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: false // Make optional
    },
    activityLevel: { 
        type: String, 
        enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active'], 
        default: 'sedentary' // This can be default
    },
    fitnessGoal: {
        type: String,
        enum: ['weight_loss', 'weight_gain', 'muscle_building', 'maintenance'],
        required: false // Make optional
    },
    diet: {
        type: String,
        enum: ['veg', 'vegan', 'nonveg', 'gluten free'], // Enum for allowed diet types
        required: false // Make optional
    },
    // Daily goals (calculated based on profile and user goal)
    calorieGoal: {
        type: Number,
        required: true
    },
    proteinGoal: {
        type: Number,
        required: true
    },
    carbGoal: {
        type: Number,
        required: true
    },
    fatGoal: {
        type: Number,
        required: true
    },
    waterGoal: {
        type: Number,
        default: 3000  // Default: 3 liters
    },
    tdee: { 
        type: Number, 
        default: 0 
    },
});

export const Profile = mongoose.model('Profile', profileSchema);
