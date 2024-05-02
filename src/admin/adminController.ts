import { NextFunction, Request, Response } from "express";
import { Admin } from "./admin.Model";
import createHttpError from "http-errors";
import bcryptPassword from "../utils/bcrytHashpasword";
import { AdminInterface } from "../types/adminTypes";



const createAdmin =async(req:Request,res:Response,next:NextFunction)=>{

    // validation request -> express validator
    // check if admin already exist ->db call
    // If yes-> send response  User already exits with this email
    // If not-> create hash password by bcryptjs
    // genrate tokens
    // DB call to create new Admin
    // Send json message with token

    const {name,email,password,avatar} = req.body

    // check if admin already exist ->db call

    try {
        
        const user = await Admin.findOne({email:email})
        if(user){
            return createHttpError(400,"Admin already exits with this email")
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
        return createHttpError(400,"Failed to create hashed password . try it again!!")
        
    }

    // Token generation JWT
    
    // create new admin in db

    let newAdmin:AdminInterface

    try {
        newAdmin = await Admin.create({
            name,
            email,
            password:hashedPassword,
            avatar,
            refreshToken
        })
        
    } catch (error) {
        return createHttpError(500,"Error while creating admin in DB")
    }


    res.status(200).json({message:'Admin is created successfully',token:hashedPassword})

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