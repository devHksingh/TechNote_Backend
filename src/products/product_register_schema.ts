import { body, header } from "express-validator";

const schema = [
    body('productName')
        .isString()
        .notEmpty(),
    body('productImg')
        .isString()
        .notEmpty()
        .optional(),
    body('description')
        .isString()
        .notEmpty()
        .optional(),
    body('quantity')
        .notEmpty(),
    body('brandName')    
        .isString()
        .notEmpty(),
    body('perPiecePrice')
        .notEmpty(),
    body('totalCost')
        .notEmpty(),
    // body('addedBy')
    //     .isString()
    //     .notEmpty(),

    header('Authorization')
        .isString()   
        .notEmpty() 

]

export {schema as createProductSchema}


