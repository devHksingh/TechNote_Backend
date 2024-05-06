import mongoose, { Schema } from "mongoose";
import { ProductInterface } from "../types/productTypes";


const productSchema = new Schema<ProductInterface>({
    name:{
        type:String,
        required:true,
        
    },
    productImg:{
        type:String
    },
    description:{
        type:String,     
    },
    quantity:{
        type:Number,
        required:true,
    },
    brandName:{
        type:String,
        required:true,
        
    },
    perPiecePrice:{
        type:Number,
        required:true
    },
    totalCost:{
        type:Number,
        required:true
    },
    addedBy:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Product = mongoose.model('Product',productSchema)