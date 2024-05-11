import { body, header } from "express-validator";

const schema = [
    body('name')
        .isString()
        .notEmpty()
        .isLength({min:2})
        .withMessage('Employee name at least 2 characters long'),
    body('email')
        .isEmail()
        .withMessage('Email must contain a valid email address'),
    body('password')
        .isLength({min:4})
        .withMessage('password is required and must be at least 4 characters long'),
    body('avatar').optional(),
    body('role')
        .isString()
        .notEmpty()
        .isLength({min:5}),
    body('salary')
        .isString()
        .notEmpty(),
        
    header('Authorization')
        .isString()   
        .notEmpty() 
]

export {schema as employeeRegisterSchema}