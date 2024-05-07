import { header } from "express-validator";

const schema = [
    header('Authorization')
        .isString()   
        .notEmpty() 
]

export {schema as getProductListSchema}