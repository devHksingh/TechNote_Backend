import { NextFunction, Request, Response } from "express";
import { Admin } from "./admin.Model";
import createHttpError from "http-errors";
import bcryptPassword from "../utils/bcrytHashpasword";
import { AdminInterface } from "../types/adminTypes";
import cloudinary from "../config/cloudinary";
import { config } from "../config/config";
import path from "node:path";
import fs from 'node:fs'
import { sign } from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary";



const createAdmin =async(req:Request,res:Response,next:NextFunction)=>{

    

    const {name,email,password,avatar} = req.body

    // check if admin already exist ->db call

    try {
        
        const user = await Admin.findOne({email:email})
        if(user){
            return next(createHttpError(400,"Admin already exits with this email"))
        }
    } catch (error) {
        return next(createHttpError(500,"Error while getting adim details"))
    }
    
    // password -> hash
    let hashedPassword =''
    try {
        if(password){
            hashedPassword = await bcryptPassword(password)   
        }   
    } catch (error) {
        return next(createHttpError(400,"Failed to create hashed password . try it again!!"))
        
    }

    // upload avatar on cloudinary 'image/png'

    

    let avatarUrl 
    if (req.files && Object.keys(req.files).length === 0) {
        console.log('No files were uploaded');
        console.log('avatar not found');
        
        avatarUrl = config.userAvatarUrl
      } else {
        // Process the uploaded files
        
        
        const files = req.files as { [filename:string]:Express.Multer.File[]}
        
        // const avatarFileName = files.avatar[0].filename
        // const avatarFilePath= path.resolve(__dirname,'../../public/data/uploads')
        const avatarLocalPath = files?.avatar[0]?.path;
        
        
        try {
            
            avatarUrl = await uploadOnCloudinary(avatarLocalPath,'techNote_Admin_Avatar')
            console.log(avatarUrl);
            
        } catch (error) {
            console.log(error);

            avatarUrl =''
            return next(createHttpError(400,'Failed to upload to cloudinary '))
        }
      }
      

    

    // jwt token  
    
    const refreshToken = await sign({sub:name},config.jwtRefreshSecret as string, {expiresIn:'7d',algorithm:"HS256"}) 
   

    let newAdmin:AdminInterface

    try {
        console.log('create admin in db');
        
         newAdmin = await Admin.create({
            name,
            email,
            password:hashedPassword,
            avatar:avatarUrl,
            refreshToken
        })

        
        
    } catch (error) {
        
        return next(createHttpError(500,"Error while creating admin in DB"))
    }
    
    const accessToken = await sign({sub: name ,id:newAdmin._id},config.jwtAccessSecret as string , {expiresIn:'2d', algorithm:"HS256",})

    res.status(201).json({message:'Admin is created successfully',accessToken:accessToken,id:newAdmin._id,url:avatarUrl})

}



const loginAdmin =async(req:Request,res:Response,next:NextFunction)=>{

    // validation request -> express validator (email & password)
    // verify email is register in DB? 
    // If Not-> send response User not exits with this email   
    // If Yes -> find user with this email and verify passowrd ? if not send reponse "Invalid Credentials" 
    // IfYes -> genrate access and refresh token 
    // send response message with access token
    // cookie?

    res.status(200).json({message:'Admin login successfully',token:"access token"})
}

const logoutAdmin = async (req:Request,res:Response,next:NextFunction)=>{
    // find admin with _id and reove Refresh Token from db

    res.status(200).json({message:'Admin logout successfully'})
}

export {createAdmin,loginAdmin,logoutAdmin}