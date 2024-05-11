import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import  {genrateAccessToken, genrateRefreshToken } from "../utils/jwtAccessToken";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary";
import bcryptPassword, { bcryptComparePassword } from "../utils/bcrytHashpasword";
import {decodeAccessTokenAndCheckExpiry, decodeRefreshTokenAndCheckExpiry} from '../utils/decodeJwtTokenAndCheckExpiry'
import { AuthRequest } from "../middlewares/authenticate";
import { config } from "../config/config";
import { TestClientInterface } from "../types/clientTypes";
import { Client } from "./client.Model";
import path from "node:path";



const createClient = async(req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password} = req.body

    // check if Client already exist ->db call

    try {
        const user = await Client.findOne({email:email})
        if(user){
            console.log('Client already exits with this email');
            
            return next(createHttpError(400,"Client already exits with this email"))
        }
    } catch (error) {
        return next(createHttpError(500,"Error while getting client details"))
    }

    let hashedPassword = ''
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
            avatarUrl = await uploadOnCloudinary(avatarLocalPath,'techNote_Client_Avatar')
        } catch (error) {
            console.log(error);

            avatarUrl =''
            return next(createHttpError(400,'Failed to upload to cloudinary '))
        }
    }

    const refreshToken = genrateRefreshToken({sub:name})
    console.log('refreshToken----------: ',refreshToken);

    // creating client on db

    let newClient
    try {
        console.log('creating client on db');

        console.log({
            "name":name,
            "email":email,
            'hashedPassword':hashedPassword,
            "avatarUrl":avatarUrl,
            "refreshToken":refreshToken
        });

        newClient = await Client.create({
            name,
            email,
            password:hashedPassword,
            avatar:avatarUrl,
            taskHistory:[],
            role:"Client",
            refreshToken,       
                  
        })
        console.log('client create on db');
        

        
        
    } catch (error) {
        return next(createHttpError(400,"Error while creating client in DB"))
    }

    // genrating access token

    const accessToken =  genrateAccessToken({id:newClient._id,role:'Client'})
    console.log('--------accessToken--------:',accessToken);

    res.status(200).json({message:'Client is created successfully',accessToken:accessToken,id:newClient._id})

}




export {
    createClient
}