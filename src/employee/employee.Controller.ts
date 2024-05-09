import { NextFunction, Request, Response } from "express";
import { Employee } from "./employee.Model";
import createHttpError from "http-errors";
import bcryptPassword from "../utils/bcrytHashpasword";
import { config } from "../config/config";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary";
import  {genrateAccessToken, genrateRefreshToken } from "../utils/jwtAccessToken";
import { EmployeeInterface } from "../types/employeeTypes";
import { AuthRequest } from "../middlewares/authenticate";


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

export {
    createEmployee,
}