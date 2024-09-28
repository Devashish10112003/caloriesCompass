import mongoose from "mongoose"

const profileSchema=new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    height: {
        type: Number,  // in cm
        required: true
    },
    weight: {
        type: Number,  // in kg
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    goal: {
        type: String,
        enum: ['weight_loss', 'weight_gain', 'muscle_building','maintainance'],
        required: true
    },
    activityLevel: { 
        type: String, 
        enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active'], 
        default: 'sedentary' },
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
})
