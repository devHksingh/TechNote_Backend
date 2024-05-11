import mongoose, { Schema } from "mongoose";

const  userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    taskHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:'Task'
        }
    ],
    role:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }

})

export const User = mongoose.model('User',userSchema)