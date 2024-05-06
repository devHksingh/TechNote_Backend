import express from 'express'
import { upload } from '../middlewares/multer.middleware'
import { createProductSchema } from './product_register_schema'
import validate_Product_req_schema from '../middlewares/validate_Express_Validator_schema'
import authenticate from '../middlewares/authenticate'
import { createProduct } from './product.controller'



const productRouter = express.Router()

// routes

productRouter.post(
    '/create',
    upload.fields([
        {name:'productImg',maxCount:1}
    ]),
    createProductSchema,
    validate_Product_req_schema,
    authenticate,
    createProduct
)

productRouter.get('/',(req,res,next)=>{
    res.status(200).json({message:'list of products'})
})



export default productRouter