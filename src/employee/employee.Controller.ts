import { NextFunction, Request, Response } from "express";
import { Employee } from "./employee.Model";
import createHttpError from "http-errors";
import { config } from "../config/config";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary";
import  {genrateAccessToken, genrateRefreshToken } from "../utils/jwtAccessToken";
import { EmployeeInterface } from "../types/employeeTypes";
import { AuthRequest } from "../middlewares/authenticate";
import {decodeAccessTokenAndCheckExpiry, decodeRefreshTokenAndCheckExpiry} from '../utils/decodeJwtTokenAndCheckExpiry'
import bcryptPassword, { bcryptComparePassword } from "../utils/bcrytHashpasword";
import { PasswordAuthRequest } from "../middlewares/changePassword.middleware";


const createEmployee = async (req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password,role,salary} = req.body

    const _req = req as AuthRequest
    const userRole = _req.userRole

    let accessToken:string
    let newEmployee:EmployeeInterface

    if((userRole === 'Admin')||(userRole === 'Manager')){

        console.log(userRole);
        
    // check if Employee already exist ->db call

        try {
            
            const user = await Employee.findOne({email:email})
            if(user){
                return next(createHttpError(400,"Employee already exits with this email"))
            }
        } catch (error) {
            return next(createHttpError(500,"Error while getting Employee details"))
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

        let avatarUrl 
        if (req.files && Object.keys(req.files).length === 0) {
            console.log('No files were uploaded');
            console.log('avatar not found');
            
            avatarUrl = config.userAvatarUrl
        } else {
            // Process the uploaded files
            
            
            const files = req.files as { [filename:string]:Express.Multer.File[]}
            
            
            const avatarLocalPath = files?.avatar[0]?.path;
            
            
            try {
                
                avatarUrl = await uploadOnCloudinary(avatarLocalPath,'techNote_Employee_Avatar')
                console.log(avatarUrl);
                
            } catch (error) {
                console.log(error);

                avatarUrl =''
                return next(createHttpError(400,'Failed to upload to cloudinary '))
            }
        }

        const refreshToken =   genrateRefreshToken({sub:name})
        
        

        try {
            console.log('create Employee in db');
            
            newEmployee = await Employee.create({
                name,
                email,
                password:hashedPassword,
                avatar:avatarUrl,
                role:role,
                taskHistory:[],
                salary,
                refreshToken
            })

            
            
        } catch (error) {
            
            return next(createHttpError(500,"Error while creating Employee in DB"))
        }
        // 
        accessToken =  genrateAccessToken({id:newEmployee._id,role:newEmployee.role})
    }else{
        return next(createHttpError(400,'unauthorized request'))
    }

    res.status(201).json({message:'Employee is created successfully',accessToken:accessToken,id:newEmployee._id})
}

const loginEmployee =  async (req:Request,res:Response,next:NextFunction)=>{

    const {email,password} = req.body
    
     
    // verify email is register in DB?
    let user

    try {
         user = await Employee.findOne({email:email})
    
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
        
        newAccessToken = genrateAccessToken({id:user._id,role:user.role})
    }else{
        console.log(' ACCESS TOKEN found');
        
        const isValidAccessToken = decodeAccessTokenAndCheckExpiry(authHeader as string,{id:user._id,role:user.role})
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
        const newRefreshToken1 = genrateRefreshToken({id:user._id,role:user.role})
        try {
            user.refreshToken = newRefreshToken1
            await user.save({validateBeforeSave:false})
            console.log('SAVE NEW REFRESH TOKEN ON DB');
        } catch (error) {
            next(createHttpError(400,`DB error falied to update refresh token`))
        }
    }else{
        console.log('VALIDATE REFRESH TOKEN ');
        const isValidRefreshToken= decodeRefreshTokenAndCheckExpiry(user.refreshToken,{id:user._id,role:user.role})

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

    


    res.status(200).json({message:`${user.role} login successfully`, newAccessToken:newAccessToken,id:user._id})
}

const logoutEmployee = async (req:Request,res:Response,next:NextFunction)=>{

    const {id} = req.body
    
    try {
        await Employee.findByIdAndUpdate(
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

    res.status(200).json({message:'Employee logout successfully'})
}
// changeCurrentPassword
const changeCurrentPassword = async (req:Request,res:Response,next:NextFunction)=>{
    const {oldPassword,newPassword} = req.body
    // const _reqPassword = req as PasswordAuthRequest
    // const hashedNewPassword = _reqPassword.userNewPassword
    // const hashedOldPassword = _reqPassword.userOldPassword

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
        user = await Employee.findById(userId)
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

const getEmployeeList = async (req:Request,res:Response,next:NextFunction)=>{
    const _req = req as AuthRequest
    const role = _req.userRole

    let employeeList

    // db call => getting list of employee

    if(role === 'Admin' || role ==='Manager'){

        try {
            employeeList = await Employee.find({}).select("-password -refreshToken")
        } catch (error) {
            return next(createHttpError(400,'Unable to fetch product list.try it again!'))
        }
    }else{
        return next(createHttpError(400,'Unauthrize request'))
    }
    res.status(200).json({message:'Employee list',employeeList:employeeList})
}
const getSingleEmployeeDetails = async (req:Request,res:Response,next:NextFunction)=>{
    const _req = req as AuthRequest
    const role = _req.userRole
    const employeeId = req.params.employeeId

    let employeeDetails

    // db call to get employee details

    if(role=== 'Admin' || role === 'Manager'){
        try {
            employeeDetails = await Employee.findById(employeeId).select("-password -refreshToken")
        } catch (error) {
            return next(createHttpError(400,'Unable to fetch employee detail.try it again!'))
        }
    }else{
        return next(createHttpError(400,'Unauthrize request'))
    }
    return res.status(200).json({message:'Single employee details',employeeDetails:employeeDetails})
}

export {
    createEmployee,
    loginEmployee,
    logoutEmployee,
    changeCurrentPassword,
    getEmployeeList,
    getSingleEmployeeDetails
}