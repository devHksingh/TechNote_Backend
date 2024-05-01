import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";


const validate_Admin_req_schema = (req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const httpError = errors.array()
        return next(createHttpError(400,`${httpError}`))
    }
    next()
}

export default validate_Admin_req_schema