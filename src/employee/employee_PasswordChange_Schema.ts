import { body, header } from "express-validator";



const schema =[
    body('oldPassword')
        .isLength({min:4})
        .withMessage('password is required and must be at least 4 characters long'),
    body('newPassword')
        .isLength({min:4})
        .withMessage('password is required and must be at least 4 characters long'),

    
    header('Authorization')
        .isString()   
        .notEmpty() 
        
]

export {schema as employeePasswordChangeSchema}