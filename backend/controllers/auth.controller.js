import User from "../models/user.model";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import bcryptjs from "bcryptjs"


// Generate JWT token
export async function signup(req,res)
{
    try
    {
        const {email,password,username}=req.body;

        if(!email||!password||username)
        {
            return res.status(400).json({success:false,message:"All field are required"})
        }

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email))
        {
            return res.status(400).json({success:false,message:"Please enter a valid email"});
        }

        const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if(!passwordRegex.test(password))
        {
            return res.status(400).json({success:false,message:"The password must consist 1 upper case 1 lowercase 1 special character 1 numerical digit and 1 special character"});
        }

        const exisitingUserByEmail=await User.findOne({email:email});

        if(exisitingUserByEmail)
        {
            return res.status(400).json({success:false,message:"email already exists"});
        }

        const exisitingUserByUsername=await User.findOne({username:username})

        if(exisitingUserByUsername)
        {
           return res.status(400).json({success:false,message:"username already exists"});
        }
        
        const salt=await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt);



        const newUser=new User({
            email,
            password: hashedPassword,
            username,
        })

        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save();
        res.status(500).json({success:true,
            user:{
                ...newUser._doc,
                password:"",
            },
        });

        

    }
    catch(error)
    {
        console.log("Error in signup",error.message);
        res.status(500).json({success:false,message:"Internal server eroor"});
    }
}

export async function login(req,res)
{
    try
    {
        const {email,password}=req.body;

        if(!email||!password)
        {
            return res.status(400).json({success:false,message:"All field are required"});
        }

        const user=await User.findOne({email:email})

        if(!user)
        {
            return res.status(404).json({success:false,message:"Invalid credentials"});   
        }

        const isPasswordCorrect=await bcryptjs.compare(password,user.password);

        if(!isPasswordCorrect)
        {
            return res.status(400).json({success:false,message:"Invalid credentials"});
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            success:true,
            user: {
                ...user._doc,
                password:""
            }
        })
    }
    catch(error){
        console.log("Error in login controller",error.message);
        res.status(500).json({success:false,message:"Internal server error"});

    }
}

export async function logout(req,res){
    try{
        res.clearCookie("jwt-trading");
        res.status(200).json({success:true,message:"Logged out succesfully"});
    }
    catch(error){
        console.log("Error in logout controller",error.message);
        res.status(500).json({success:false,message:"Internal server error"});
    }
}
