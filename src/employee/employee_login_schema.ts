import { body } from "express-validator";



const schema =[
    body('email')
        .isEmail()
        .withMessage('Email must contain a valid email address'),
    body('password')
        .isLength({min:4})
        .withMessage('password is required and must be at least 4 characters long'),

    
    
        
]

export {schema as employeeLoginSchema}