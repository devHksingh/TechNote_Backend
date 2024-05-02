import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";


const validate_Admin_req_schema = (req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        // const [{msg}] = errors.array()
        
        return res.status(400).json({ errors: errors.array() });
        // return next(createHttpError(400,`${msg}`))
    }
    next()
}

export default validate_Admin_req_schema