import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken'
import { config } from "../config/config";



const authenticate = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.header('Authorization')
    
    if(!(token && (token?.startsWith('Bearer ')))){
        
        
        return next(createHttpError(401,'Auth token is required'))
    }
    // req.header('Authorization') = token.split(' ')[1]
    const userAccessToken = token.split(' ')[1]
      // Verify access token
    try {
        const isValidAndDecoded = jwt.verify(userAccessToken, config.jwtAccessSecret as string);
        next(); // Proceed if verification is successful
    } catch (error) {
        // console.error( error === 'TokenExpiredError'); // Avoid logging entire token
        // return next(createHttpError(401, `${error.TokenExpiredError}`));
        if(error instanceof jwt.TokenExpiredError){
            
            
            next()
        }else{
            console.error(error); // Log other errors
            return next(createHttpError(401, 'Unauthorized'));
        }
    }

  
    
    
}

export default authenticate