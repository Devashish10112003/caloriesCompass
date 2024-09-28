import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealName: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    fats: {
        type: Number,
        required: true
    },
    dateLogged: {
        type: Date,
        default: Date.now  // Automatically logs the current date/time
    }
});

export const Meal = mongoose.model('Meal', mealSchema);