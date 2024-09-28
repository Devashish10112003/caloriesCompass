import dotenv from "dotenv";

dotenv.config();

export const ENV_VARS={
    MONGO_URI : process.env.MONGO_URI,
    PORT: process.env.PORT||5000,
    JWT_SECRET:process.env.JWT_SECRET,
    NODE_ENV:process.env.NODE_ENV,
    NUTRITIONIX_APP_ID: env.NUTRITIONIX_APP_ID,
    NUTRITIONIX_API_KEY: env.NUTRITIONIX_API_KEY
}