import { NextFunction, Request, Response } from "express";
import { Admin } from "./admin.Model";
import createHttpError from "http-errors";
import bcryptPassword, { bcryptComparePassword } from "../utils/bcrytHashpasword";
import { AdminInterface } from "../types/adminTypes";
import cloudinary from "../config/cloudinary";
import { config } from "../config/config";
import path from "node:path";
import fs from 'node:fs'
import { JwtPayload, sign } from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary";
import jwt from 'jsonwebtoken'
import  {genrateAccessToken, genrateRefreshToken } from "../utils/jwtAccessToken";
import {decodeAccessTokenAndCheckExpiry, decodeRefreshTokenAndCheckExpiry} from '../utils/decodeJwtTokenAndCheckExpiry'


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
      

    

    // jwt token  sign({sub:name},config.jwtRefreshSecret as string, {expiresIn:'7d',algorithm:"HS256"})
    
    const refreshToken =   genrateRefreshToken({sub:name})
   

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
    // 
    const accessToken =  genrateAccessToken({id:newAdmin._id})

    res.status(201).json({message:'Admin is created successfully',accessToken:`Bearer ${accessToken}`,id:newAdmin._id})

}



const loginAdmin =async(req:Request,res:Response,next:NextFunction)=>{

    // validation request -> express validator (email & password)
    // verify email is register in DB? 
    // If Not-> send response User not exits with this email   
    // If Yes -> find user with this email and verify passowrd ? if not send reponse "Invalid Credentials" 
    // IfYes -> genrate access and refresh token 
    // send response message with access token
    // cookie?

    const {email,password} = req.body
    
     
    // verify email is register in DB?
    let user

    try {
         user = await Admin.findOne({email:email})
    
        if(!user){
            return next(createHttpError(404,"User not found"))
    
        }
    } catch (error) {
        return next(createHttpError(500,"DB CONNECTION PROBLEM"))
    }
    const userPassowrd = user.password
    const isMatchPassword = await bcryptComparePassword(password,userPassowrd)
    if(!isMatchPassword){
        return next(createHttpError(400,'Invalid Credentials'))
    }
        
    // check access token
    const authHeader = (req.headers.authorization)?.split(' ')[1]
    console.log(authHeader);
    let newAccessToken

    if(!authHeader){
        console.log('NO ACCESS TOKEN FOUND');
        
        newAccessToken = genrateAccessToken({id:user._id})
    }else{
        console.log('VERIFY ACCESS TOKEN');
        
        const isValidAccessToken = decodeAccessTokenAndCheckExpiry(authHeader as string,{id:user._id})
    
        if(isValidAccessToken?.isInvalid){
            return next(createHttpError(402,`Invalid Token`))
        }
        if(isValidAccessToken?.isTokenExp){
            console.log('EXP ACCESS TOKEN');
            
             newAccessToken = isValidAccessToken.accessToken
        }else if(!isValidAccessToken?.isTokenExp){
            newAccessToken = authHeader
        }

    }
    
    // check refresh token

    const userRefreshToken = user.refreshToken

    if(!userRefreshToken){
        console.log('NO REFRESH TOKEN FOUND');
        const newRefreshToken1 = genrateRefreshToken({id:user._id})
        try {
            user.refreshToken = newRefreshToken1
            await user.save({validateBeforeSave:false})
            console.log('SAVE NEW REFRESH TOKEN ON DB');
        } catch (error) {
            next(createHttpError(400,`DB error falied to update refresh token`))
        }
    }else{
        console.log('VALIDATE REFRESH TOKEN ');
        const isValidRefreshToken= decodeRefreshTokenAndCheckExpiry(user.refreshToken,{id:user._id})

        let newRefreshToken
    
        if(isValidRefreshToken?.isInvalid){
            return next(createHttpError(403,`Invalid Token`))
        }
        if(isValidRefreshToken?.isTokenExp){
                  
            newRefreshToken = isValidRefreshToken.refreshToken
            // update new refresh token in db
            try {
                user.refreshToken = newRefreshToken
                         
                await user.save({validateBeforeSave:false})
                console.log('REGENRATE REFRESH TOKEN ON DB');
                
            } catch (error) {
                next(createHttpError(400,`DB error falied to update refresh token`))
            }
        }
        
    }

    


    res.status(200).json({message:'Admin login successfully', newAccessToken:newAccessToken,id:user._id})
}

const logoutAdmin = async (req:Request,res:Response,next:NextFunction)=>{
    // find admin with _id and reove Refresh Token from db
    const {id} = req.body
    
    try {
        await Admin.findByIdAndUpdate(
            id,
            {
                $set:{
                    refreshToken: '',
                },
                
            },
            {
                new:true,
            }
        )
    } catch (error) {
        return next(createHttpError(400,'Invalid credentails'))
    }

    // try {
    //      user = await Admin.findOne({email:email})
    
    //     if(!user){
    //         return next(createHttpError(404,"User not found"))
    
    //     }
    // } catch (error) {
    //     return next(createHttpError(500,"DB CONNECTION PROBLEM"))
    // }
    // try {
    //     user.refreshToken = ''
    //     await user.save({validateBeforeSave:false})
    // } catch (error) {
    //     return next(createHttpError(400,'unable to logOut try it again!'))
    // }
   
    
    res.status(200).json({message:'Admin logout successfully'})
}

export {createAdmin,loginAdmin,logoutAdmin}


