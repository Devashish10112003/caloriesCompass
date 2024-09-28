import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export async function protectRoute(req,res,next)
{
    try{
        const token=req.cookies["jwt-trading"];

        if(!token)
        {
            return res.status(401).json({success:false,message:"unauthorized - No token provided"});
        }

        const decoded = jwt.verify(token,ENV_VARS.JWT_SECRET);

        if(!decoded)
        {
            return res.status(401).json({success:false,message:"unauthorized - Invalid Token"});
        }

        const user=await User.findById(decoded.userId).select("-password");

        if(!user)
        {
            return res.status(404).json({success:false, message:"User not found"});
        }

        req.user=user;

        next();  
    }
    catch(error)
    {
        console.log("Error in protectRoute middleware : ",error.message);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
}