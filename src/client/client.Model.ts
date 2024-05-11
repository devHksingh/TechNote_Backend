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
// const clientSchema = new mongoose.Schema<ClientInterface>({
//     name:{
//         type:String,
//         required:true,
//         lowercase:true,
        
//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true,
//         lowercase:true,
//         trim:true,
//     },
//     avatar:{
//         type:String, //cloudinary url
        
//     },
//     password:{
//         type:String,
//         required: [true,'Password is required']

//     },
//     refreshToken:{
//         type:String
//     },
//     role:{
//         type:String,
//         required:true
//     },
//     taskHistory:[{
//         type:Schema.Types.ObjectId,
//         ref:'Task'
//     }],
    
    
// },{timestamps:true})

export const Client = mongoose.model('Client',clientSchema)