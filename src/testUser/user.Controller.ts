import { NextFunction, Request, Response } from "express";
import { User } from "./user.Model";
import createHttpError from "http-errors";
import bcryptPassword from "../utils/bcrytHashpasword";
import { config } from "../config/config";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary";
import { genrateRefreshToken } from "../utils/jwtAccessToken";




const createUser = async (req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password}= req.body

    // check if user already exist ->db call

    try {
        const user = await User.findOne({email:email})
        if(user){
            console.log('User already exits with this email');
            
            return next(createHttpError(400,"User already exits with this email"))
        }
    } catch (error) {
        return next(createHttpError(500,"Error while getting client details"))
    }

    // hashed password
    let hashedPassword 
    try {
        hashedPassword = await bcryptPassword(password)
        console.log('hashedPassword--------: ',hashedPassword);
    } catch (error) {
        return next(createHttpError(400,"Error while creating hashed password"))
    }

    // upload avatar on cloudinary

    let avatarUrl
    if(req.files && Object.keys(req.files).length === 0){
        console.log('avatar not found');

        avatarUrl = config.userAvatarUrl
    }else{

        const files = req.files as {[filename:string]:Express.Multer.File[]}
        const avatarLocalPath = files?.avatar[0]?.path;

        // upload

        try {
            avatarUrl = await uploadOnCloudinary(avatarLocalPath,'techNote_USER_Avatar')
        } catch (error) {
            console.log(error);

            avatarUrl =''
            return next(createHttpError(400,'Failed to upload to cloudinary '))
        }
    }

    const refreshToken = genrateRefreshToken({sub:name})
    console.log('refreshToken----------: ',refreshToken);

    // creating user on db

    let newUser
    try {
        
        console.log('creating client on db');

        console.log({
            "name":name,
            "email":email,
            'hashedPassword':hashedPassword,
            "avatarUrl":avatarUrl,
            "refreshToken":refreshToken
        });

        newUser = await User.create({
            name,
            email,
            password:hashedPassword,
            avatar:avatarUrl,
            taskHistory:[],
            refreshToken,
            role:'Client',
        
        })

    } catch (error) {
        return next(createHttpError(400,"Error while creating client in DB"))
    }

    return res.status(200).json({msg:"User is created ",id:newUser._id})
}


export {
    createUser
}