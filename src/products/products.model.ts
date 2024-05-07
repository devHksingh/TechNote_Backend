import mongoose, { Schema } from "mongoose";
import { ProductInterface } from "../types/productTypes";


const productSchema = new Schema<ProductInterface>({
    productName:{
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
        type:String,
        required:true,
    },
    brandName:{
        type:String,
        required:true,
        
    },
    perPiecePrice:{
        type:String,
        required:true
    },
    totalCost:{
        type:String,
        required:true
    },
    addedBy:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Product = mongoose.model('Product',productSchema)