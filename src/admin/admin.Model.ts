import mongoose, { Schema } from "mongoose";
import { AdminInterface } from "../types/adminTypes";

const adminSchema = new Schema<AdminInterface>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        
    },
    role:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
        required:true
    },
    
},{timestamps:true})

export const Admin = mongoose.model('Admin',adminSchema)

