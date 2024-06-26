import mongoose, { Schema } from "mongoose";
import { EmployeeInterface } from "../types/employeeTypes";

const employeeSchema = new mongoose.Schema<EmployeeInterface>({
    name:{
        type:String,
        required:true,
        
        lowercase:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    avatar:{
        type:String, //cloudinary url
        
    },
    password:{
        type:String,
        required: [true,'Password is required']

    },
    refreshToken:{
        type:String
    },
    role:{
        type:String,
        required:true
    },
    taskHistory:[{
        type:Schema.Types.ObjectId,
        ref:'Task'
    }],
    salary:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Employee = mongoose.model('Employee',employeeSchema)