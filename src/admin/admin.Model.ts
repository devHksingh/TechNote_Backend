import mongoose, { Schema } from "mongoose";
import { AdminInterface } from "../types/adminTypes";
import jwt from 'jsonwebtoken'

/*
export interface AdminInterface {
    _id:string;
    name:string;
    email:string;
    password:string;
    avatar:string;
    refreshToken:string;
    createdAt:Date;
    updatedAt:Date;
    
}
*/
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
    refreshToken:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Admin = mongoose.model('Admin',adminSchema)

