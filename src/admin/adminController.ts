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
import genrateAccessToken from "../utils/jwtAccessToken";
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
      

    

    // jwt token  
    
    const refreshToken =  sign({sub:name},config.jwtRefreshSecret as string, {expiresIn:'60',algorithm:"HS256"}) 
   

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
    
    const accessToken =  sign({id:newAdmin._id},config.jwtAccessSecret as string , {expiresIn:'120', algorithm:"HS256",})

    res.status(201).json({message:'Admin is created successfully',accessToken:`Bearer ${accessToken}`})

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
    console.log(req.headers);
    
    const authHeader = (req.headers.authorization)?.split(' ')[1]
    console.log(authHeader);
    
    
    
    
    

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

    const isValidAccessToken = decodeAccessTokenAndCheckExpiry(authHeader as string,{id:user._id})
    console.log(isValidAccessToken);


    let newAccessToken
    if(isValidAccessToken?.isInvalid){
        return next(createHttpError(402,`Invalid Token`))
    }
    if(isValidAccessToken?.isTokenExp){
        console.log(isValidAccessToken.message);
        console.log('1111111111111111111111');
        
        
         newAccessToken = isValidAccessToken.accessToken
    }else if(!isValidAccessToken?.isTokenExp){
        newAccessToken = authHeader
    }
    console.log(newAccessToken);

    // check refresh token

    const isValidRefreshToken= decodeRefreshTokenAndCheckExpiry(user.refreshToken,{id:user._id})

    let newRefreshToken

    if(isValidRefreshToken?.isInvalid){
        return next(createHttpError(403,`Invalid Token`))
    }
    if(isValidRefreshToken?.isTokenExp){
        console.log(`${isValidRefreshToken.message}`);
        
        newRefreshToken = isValidRefreshToken.refreshToken
        // update new refresh token in db
        try {
            user.refreshToken = newRefreshToken
            
            
            await user.save({validateBeforeSave:false})
            console.log('new resfresh token : ',newRefreshToken);
        } catch (error) {
            next(createHttpError(400,`DB error falied to update refresh token`))
        }
    }





    
    

    // check jwt expiry
    // let decodeToken 
    // try {
    //      if(authHeader){
    //         decodeToken = jwt.verify(authHeader,config.jwtAccessSecret as string)
    //      }
        
    //     } catch (error) {
    //     return next(createHttpError(400,'Invalid token'))
    // }

    // const isExpiredAccessToken = Date.now() >= decodeToken.exp *1000
    
    // let newAccessToken
    // if(decodeToken){
    //     const payload = decodeToken as JwtPayload
    //     console.log(payload.exp);
    //     const payloadExp = payload.exp
    //     if(payloadExp){
    //         const isExpiredAccessToken = Date.now() >= payloadExp *1000
    //         console.log(isExpiredAccessToken)

    //         if(!isExpiredAccessToken){
    //              newAccessToken = genrateAccessToken({id:user._id})
    //         }
    //         // const currentTime = Date.now()
    //         // if (payloadExp < currentTime) {
    //         //     // return { isExpired: true }; // Token is expired
    //         //     console.log('{ isExpired: true }')
    //         //   } else {
    //         //     // return { isExpired: false }; // Token is valid, return decoded data
    //         //     console.log('{ isExpired: false }')
    //         //   }
    //     }
        

    // }
    // check if refreshToken is expired

    // let newRefreshToken
    // const oldRefresh
    
    /*
    function verifyJwtToken(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey);
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

    // Check if token expiration (exp) is in the future
    if (decoded.exp < currentTime) {
      return { isExpired: true }; // Token is expired
    } else {
      return { isExpired: false, decoded }; // Token is valid, return decoded data
    }
  } catch (error) {
    // Handle JWT verification errors (e.g., invalid signature, malformed token)
    console.error('Error verifying JWT token:', error);
    return { isExpired: true }; // Consider expired for security reasons
  }
}
    */


    

        
    
    


    res.status(200).json({message:'Admin login successfully'})
}

const logoutAdmin = async (req:Request,res:Response,next:NextFunction)=>{
    // find admin with _id and reove Refresh Token from db

    res.status(200).json({message:'Admin logout successfully'})
}

export {createAdmin,loginAdmin,logoutAdmin}


