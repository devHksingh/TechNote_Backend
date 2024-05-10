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
import { AuthRequest } from "../middlewares/authenticate";
import { PasswordAuthRequest } from "../middlewares/changePassword.middleware";


const createAdmin =async(req:Request,res:Response,next:NextFunction)=>{

    

    const {name,email,password} = req.body

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
            role:'Admin',
            refreshToken
        })

        
        
    } catch (error) {
        
        return next(createHttpError(500,"Error while creating admin in DB"))
    }
    // 
    const accessToken =  genrateAccessToken({id:newAdmin._id,role:'Admin'})

    res.status(201).json({message:'Admin is created successfully',accessToken:accessToken,id:newAdmin._id})

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
    
    let newAccessToken

    if(!authHeader){
        console.log('NO ACCESS TOKEN FOUND');
        
        newAccessToken = genrateAccessToken({id:user._id,role:'Admin'})
    }else{
        console.log(' ACCESS TOKEN found');
        
        const isValidAccessToken = decodeAccessTokenAndCheckExpiry(authHeader as string,{id:user._id,role:'Admin'})
        console.log(' ACCESS TOKEN viryfication done');
    
        if(isValidAccessToken?.isInvalid){
            return next(createHttpError(402,`Invalid Token`))
        }
        if(isValidAccessToken?.isTokenExp){
            console.log('EXP ACCESS TOKEN');
            
             newAccessToken = isValidAccessToken.accessToken
        }else if(!isValidAccessToken?.isTokenExp){
            console.log('access token = auth header');
            
            newAccessToken = authHeader
        }

    }
    
    // check refresh token

    const userRefreshToken = user.refreshToken

    if(!userRefreshToken){
        console.log('NO REFRESH TOKEN FOUND');
        const newRefreshToken1 = genrateRefreshToken({id:user._id,role:'Admin'})
        try {
            user.refreshToken = newRefreshToken1
            await user.save({validateBeforeSave:false})
            console.log('SAVE NEW REFRESH TOKEN ON DB');
        } catch (error) {
            next(createHttpError(400,`DB error falied to update refresh token`))
        }
    }else{
        console.log('VALIDATE REFRESH TOKEN ');
        const isValidRefreshToken= decodeRefreshTokenAndCheckExpiry(user.refreshToken,{id:user._id,role:'Admin'})

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

// const changeCurrentPassword = async (req:Request,res:Response,next:NextFunction)=>{

//     const { oldPassword, newPassword } = req.body
//     const _req = req as AuthRequest
//     const id = _req.userId

//     const _reqPassword = req as PasswordAuthRequest

//     const hashedOldPassword = _reqPassword.userOldPassword
//     const hashedNewPassword = _reqPassword.userNewPassword
//     console.log('hashedNewPassword : ',hashedNewPassword);
    

//     // check oldpassword
//     let user
    

//     try {
//         user = await Admin.findByIdAndUpdate(
//             {
//                 _id:id
//             },
//             {
//                 password:hashedNewPassword
//             },
//             {
//                 new:true
//             }
//         )
//         console.log('new password in db:',user?.password);
        
//     } catch (error) {
//         next(createHttpError(400,'unable to update password'))
//     }

//     // try {
//     //     user = await Admin.findById(id)
        
//     //     if(user){
//     //         console.log('old PASSWORD : ',user.password);
            
//     //         user.password = hashedNewPassword
//     //         console.log('NEW HASH PASSWORD : ',hashedNewPassword);
            
//     //         await user.save({validateBeforeSave:false})
//     //         console.log('password save');
            
//     //     }
//     // } catch (error) {
//     //     next(createHttpError(400,'unable to update password'))
//     // }

//     // user?.password = hashedNewPassword

//     // save new password

//     res.status(200).json({message:'new password save successfully',newpassword:user?.password,hashNeW:hashedNewPassword})
    

// }

const changeCurrentPassword =  async (req:Request,res:Response,next:NextFunction)=>{
    const {oldPassword,newPassword} = req.body

    if(!oldPassword || !newPassword){
        return next(createHttpError(400,'Both new and old password required'))
    }
    if(oldPassword === newPassword){
        return next(createHttpError(400,'Both password required must different'))
    }

    
    const _req = req as AuthRequest
    const userId = _req.userId
    const userRole = _req.userRole

    let user
    try {
        user = await Admin.findById(userId)
        if(!user){
            return  next(createHttpError(400,'User Not found'))
        }
        console.log('------user------',user);
        
        console.log('old password in db:',user?.password);
        if(!(user?.role === userRole)){
            return  next(createHttpError(400,'Invalid user role'))
        }
        // validate old password 
        try {
            const isValidOldPassword = await bcryptComparePassword(oldPassword,user?.password as string)
            console.log('isValidOldPassword',isValidOldPassword);
            if(!isValidOldPassword){
                return next(createHttpError(400,'Invalid old password'))
            }
            
        } catch (error) {
            return next(createHttpError(400,'Invalid old password'))
        }
        const hashedNewPassword = await bcryptPassword(newPassword);
        console.log('----hashedNewPassword----: ',hashedNewPassword);
        

        if(user){
            user.password = hashedNewPassword
            user.save({validateBeforeSave:false})
        }

    } catch (error) {
        return next(createHttpError(400,'unable to Find Employee'))
    }

    res.status(200).json({message:'new password save successfully',newpassword:user?.password})
}

export {createAdmin,loginAdmin,logoutAdmin,changeCurrentPassword}


