import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken'
import { config } from "../config/config";



const authenticate = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.header('Authorization')
    // if(token?.startsWith('Bearer '))
    if((!token)&&(!(token?.startsWith('Bearer ')))){
        return next(createHttpError(401,'Auth token is required'))
    }
    // req.header('Authorization') = token.split(' ')[1]
    const userAccessToken = token.split(' ')[1]
    // verify accesss token
    const isValidAndDecoded = jwt.verify(userAccessToken,config.jwtAccessSecret as string)
    if(!isValidAndDecoded){
        return next(createHttpError(402,'Invalid token'))
    }
    
    next()
}

export default authenticate