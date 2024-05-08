import { NextFunction, Request, Response } from "express"
import bcryptPassword from "../utils/bcrytHashpasword"
import createHttpError from "http-errors"

export interface AuthRequest extends Request{
    userId:String;
    userRole:String;
}

export interface AdminAuthRequest extends Request{
    userOldPassword:string;
    userNewPassword:string;

}

const changePassword = async(req:Request,res:Response,next:NextFunction) => {
    const { oldPassword, newPassword } = req.body
    const hashedOldPassword =await bcryptPassword(oldPassword)
    const hashedNewPassword = await bcryptPassword(newPassword)
    if(hashedNewPassword === hashedOldPassword){
        return next(createHttpError(400,'Enter correct newPassword'))
    }
    const _req = req as AdminAuthRequest

    // _req.userOldPassword = hashedOldPassword 
    // _req.userNewPassword = hashedNewPassword

    _req.userOldPassword = hashedOldPassword as string
    _req.userNewPassword = hashedNewPassword as string
    next()
}

export default changePassword