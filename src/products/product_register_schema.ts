import { body, header } from "express-validator";

const schema = [
    body('name')
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
        .isNumeric(),
    body('brandName')    
        .isString()
        .notEmpty(),
    body('perPiecePrice')
        .isNumeric(),
    body('totalCost')
        .isNumeric(),
    body('addedBy')
        .isString()
        .notEmpty(),

    header('Authorization')
        .isString()   
        .notEmpty() 

]

export {schema as createProductSchema}


