import mongoose from "mongoose";

const waterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,  // in milliliters
        required: true
    },
    dateLogged: {
        type: Date,
        default: Date.now
    }
});

export const WaterLog = mongoose.model('WaterLog', waterSchema);

