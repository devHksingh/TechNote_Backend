import express, { NextFunction, Request, Response } from 'express'
import { upload } from '../middlewares/multer.middleware'
import { createProductSchema } from './product_register_schema'
import validate_Product_req_schema from '../middlewares/validate_Express_Validator_schema'
import authenticate from '../middlewares/authenticate'
import { createProduct, getProductList } from './product.controller'
import { getProductListSchema } from './products_get_schema'



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

productRouter.get('/',
getProductListSchema,
validate_Product_req_schema,
authenticate,
getProductList)



export default productRouter