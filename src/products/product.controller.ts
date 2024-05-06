import { NextFunction, Request, Response } from "express"
import { Product } from "./products.model"
import createHttpError from "http-errors"
import { config } from "../config/config"
import { getImageUrl, uploadOnCloudinary } from "../utils/uploadOnCloudinary"
import jwt from 'jsonwebtoken'


const createProduct = async (req:Request,res:Response,next:NextFunction)=>{
    const {name,description,quantity,brandName,perPiecePrice,totalCost,addedBy} = req.body
    console.log(req.body);

    
// (req.headers.authorization)?.split(' ')[1]
    // const authToken = (req.headers.authorization)?.split(' ')[1]
    // let userId
    // let userRole
    // if(authToken){
    //     const result = jwt.decode(authToken)
    //     if(result){
    //         userId = result?.id
    //         userRole = result?.role
    //     }
        
    // }
    

    try {
        
        const product = await Product.findOne({name:name})
        if(product){
            return next(createHttpError(400,"product already exits with this name"))
        }
    } catch (error) {
        return next(createHttpError(500,"Error while getting product details"))
    }

    // upload  on cloudinary 

    
    let productImgUrl
    if(req.files && Object.keys(req.files).length === 0){
        console.log('no product img uploaded');
        
        productImgUrl = getImageUrl(config.productImgId as string)
        console.log(productImgUrl);
        
    }else{

        const files = req.files as {[filename:string]:Express.Multer.File[]}
        const productImgLocalPath = files?.productImg[0]?.path
        try {

            // upload on cloudnary
            productImgUrl= await uploadOnCloudinary(productImgLocalPath,'techNote_ProductImg')
            console.log(productImgUrl);
        } catch (error) {
            productImgUrl =''
            return next(createHttpError(400,'Failed to upload to cloudinary '))
        }
    }

    res.status(200).json({message:'product creat successfully', req:req.body})
    
}

export {
    createProduct
}