import { NextFunction, Request, Response } from "express"
import { Product } from "./products.model"
import createHttpError from "http-errors"
import { config } from "../config/config"
import { getImageUrl, uploadOnCloudinary } from "../utils/uploadOnCloudinary"
import jwt from 'jsonwebtoken'
import { AuthRequest } from "../middlewares/authenticate"
import { Admin } from "../admin/admin.Model"
import cloudinary from "../config/cloudinary"


const createProduct = async (req:Request,res:Response,next:NextFunction)=>{
    const {productName,description,quantity,brandName,perPiecePrice,totalCost,addedBy} = req.body
    console.log(req.body);

    // check product is already exist in db

    try {
        
        const product = await Product.findOne({productName:productName})
        if(product){
            return next(createHttpError(400,"product already exits with this name"))
        }
    } catch (error) {
        return next(createHttpError(500,"Error while getting product details"))
    }

    // getting id and role from token through middleware

    const _req = req as AuthRequest
    console.log('_req',_req.userId);
    console.log('_req',_req.userRole);

    const id = _req.userId
    const role = _req.userRole
    // find user based on Role Admin|Manager
    let user
    
    if (role === 'Admin'){
        try {
            user = await Admin.findById(id).select("-password -refreshToken")
            
        } catch (error) {
            return next(createHttpError(400,'Unable to find user'))

        }

    }else{
        try {
            // DB call to find Manger details
        } catch (error) {
            return next(createHttpError(400,'Unable to find user'))
        }
    }

    

    
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
    

    

    // upload  on cloudinary 

    
    let productImgUrl
    if(req.files && Object.keys(req.files).length === 0){
        console.log('no product img uploaded');
        
        productImgUrl = await getImageUrl(config.productImgId as string)

        
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
    
    // covert if value in string

    // creating new Product
    
    // let newProduct
    // try {
    //     newProduct = await Product.create({
    //         productName,
    //         productImg:productImgUrl,
    //         description,
    //         quantity,
    //         brandName,
    //         perPiecePrice,
    //         totalCost,
    //         addedBy:user?.name||'Unknown'
    //     })
    // } catch (error) {
    //     return next(createHttpError(402,'Unable to create the product on db'))
    // }
    // if(type === 'string'){
        
    //    const Newquantity = parseInt(quantity)
    //    const NewperPiecePrice = parseInt(perPiecePrice)
    //    const NewtotalCost = parseInt(totalCost)
    // //    const Newquantity = parseInt(quantity)
    //     console.log('hi');
        
    //     console.log(Newquantity,NewperPiecePrice,NewtotalCost);
        

     
    // }

    let newProduct
    try {
        newProduct = await Product.create({
            productName,
            productImg:productImgUrl,
            description,
            quantity,
            brandName,
            perPiecePrice,
            totalCost,
            addedBy:user?.name 

        })
    } catch (error) {
        return next(createHttpError(402,'Unable to create the product on db'))
    }
    
    /*
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
    
    */
    

    res.status(200).json({message:'product created successfully', req:req.body,id:newProduct?._id})
    
}

const getProductList = async (req:Request,res:Response,next:NextFunction)=>{
    
    const _req = req as AuthRequest

    const id = _req.userId
    const role = _req.userRole
    let productList

    if((role ==='Admin')||(role === 'Manager')||(role === 'Employee')){
        try {
            productList = await Product.find({})
        } catch (error) {
            return next(createHttpError(400,'Unable to fetch product list.try it again!'))
        }
    }else{
        return next(createHttpError(400,'Unauthrize request'))
    }
    res.status(200).json({message:'List products',productList:productList})

}

const getSingleProduct = async (req:Request,res:Response,next:NextFunction)=>{

    const _req = req as AuthRequest
    const role = _req.userRole
    const id = _req.userId
    const productId = req.params.productId
    let productDetail

    if((role ==='Admin')||(role === 'Manager')||(role === 'Employee')){
       
        try {
            productDetail=  await Product.findOne({_id:productId})
        } catch (error) {
            return next(createHttpError(400,'Unable to fetch product list.try it again!'))
        }
    }else{
        return next(createHttpError(400,'Unauthrize request'))
    }



    res.status(200).json({message:'Single product',productDetail:productDetail})
}

const deleteProduct = async (req:Request,res:Response,next:NextFunction)=>{
    const _req = req as AuthRequest
    const role = _req.userRole
    const id = _req.userId
    const productId = req.params.productId
    let productDetail

    if((role ==='Admin')||(role === 'Manager')){
       
        try {
            productDetail=  await Product.findOne({_id:productId})
            const productImgSlpits = productDetail?.productImg.split('/')
            const productImgPublicId = productImgSlpits?.at(-3) + '/'+ productImgSlpits?.at(-2)+'/'+(productImgSlpits?.at(-1)?.split('?').at(-2))
            // console.log(productImgSlpits);
            // console.log((productImgSlpits?.at(-1))?.split('?').at(0));
            // console.log(((productImgSlpits?.at(-1))?.split('?').at(0))=== config.productImgId);
            // console.log(config.productImgId);
            // console.log(productImgPublicId);
            console.log(productImgPublicId === config.productImgId);
            console.log('$$$$$$$$$$$$$$$$$$$$');
            
            // console.log(productImgPublicId);
            
            
            if(!(productImgPublicId === config.productImgId)){
                console.log('img id is same');
                // delete product only
                try {
                    await Product.deleteOne({_id:productDetail?._id})
                } catch (error) {
                    return next(createHttpError(400,'unable to delete product try it again!'))
                }
                
            }else{
                console.log('img id not same');
                try {
                    await cloudinary.uploader.destroy(productImgPublicId)
                    try {
                        await Product.deleteOne({_id:productDetail?._id})
                    } catch (error) {
                        return next(createHttpError(400,'unable to delete product try it again!'))
                    }
                } catch (error) {
                    return next(createHttpError(400,'unable to delete product Image try it again!'))
                }
            }
            
        } catch (error) {
            return next(createHttpError(400,'Unable to fetch product list.try it again!'))
        }
    }else{
        return next(createHttpError(400,'Unauthrize request'))
    }



    res.status(200).json({message:'Deleted successfully',productDetail:productDetail})
}

export {
    createProduct,
    getProductList,
    getSingleProduct,
    deleteProduct,
}