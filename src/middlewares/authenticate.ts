import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken'
import { config } from "../config/config";

export interface AuthRequest extends Request{
    userId:String;
    userRole:String;
}

const authenticate = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.header('Authorization')
    
    if(!(token && (token?.startsWith('Bearer ')))){
        
        
        return next(createHttpError(401,'Auth token is required'))
    }
    // req.header('Authorization') = token.split(' ')[1]
    const userAccessToken = token.split(' ')[1]
      // Verify access token
    try {
        const isValidAndDecoded = jwt.verify(userAccessToken, config.jwtAccessSecret as string) as jwt.JwtPayload;;
        console.log('decoded token',isValidAndDecoded);
        console.log('decoded token sub',isValidAndDecoded.sub);
        
        const _req = req as AuthRequest
        // _req.userId = isValidAndDecoded?.id as string
        const {id,role} = isValidAndDecoded
        _req.userId = id as string
        _req.userRole = role as string
        next(); // Proceed if verification is successful
    } catch (error) {
        
        if(error instanceof jwt.TokenExpiredError){ 
            
            next()
        }else{
            console.error(error); // Log other errors
            return next(createHttpError(401, 'Unauthorized token'));
        }
    }

  
    
    
}

export default authenticate