import mongoose, { Schema } from "mongoose";
import { TestClientInterface } from "../types/clientTypes";

const clientSchema = new Schema<TestClientInterface>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
    },
    taskHistory:[{
        type:Schema.Types.ObjectId,
        ref:'Task'
    }],
    role:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }
})
export const Client = mongoose.model('Client',clientSchema)