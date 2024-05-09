import { NextFunction, Request, Response } from "express"
import bcryptPassword, { bcryptComparePassword } from "../utils/bcrytHashpasword"
import createHttpError from "http-errors"
import { AuthRequest } from "./authenticate";
import { Admin } from "../admin/admin.Model";



export interface PasswordAuthRequest extends Request{
    userOldPassword:string;
    userNewPassword:string;

}

// const changePassword = async(req:Request,res:Response,next:NextFunction) => {
//     const { oldPassword, newPassword } = req.body
//     const _req = req as AuthRequest
//     const id=  _req.userId
//     console.log('@ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @ @@@@@@@@@@@@@@@@@@');
//     console.log('id',id);
    
//     console.log('middleware old:',oldPassword);
//     console.log('middleware new:',newPassword);
    
//     // const hashedOldPassword =await bcryptPassword(oldPassword)
//     // const hashedNewPassword = await bcryptPassword(newPassword)
//     // if(hashedNewPassword === hashedOldPassword){
//     //     return next(createHttpError(400,'Enter correct newPassword'))
//     // }
//     let user 
//     try {
//         user = await Admin.findById(id)
//         console.log('midleware change password user',user);
        
//     } catch (error) {
//         return next(createHttpError(400,'Invalid User'))
//     }
//     try {
//         const isValidOldPassword = await bcryptComparePassword(oldPassword,user?.password as string)
//         console.log('isValidOldPassword',isValidOldPassword);
        
//         if(isValidOldPassword){
//             const hashedNewPassword = await bcryptPassword(newPassword)
//             const hashedOldPassword = await bcryptPassword(oldPassword)
    
//             const _reqPassword = req as PasswordAuthRequest
//             _reqPassword.userOldPassword = hashedOldPassword
//             _reqPassword.userNewPassword = hashedNewPassword
    
//             console.log('midleware change password _reqPassword.userOldPassword',_reqPassword.userOldPassword);
//             console.log('midleware change password _reqPassword.userNewPassword',_reqPassword.userNewPassword);
    
//             console.log(_reqPassword.userNewPassword === _reqPassword.userOldPassword);
            
//             console.log('# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  ##  # # #  ');
            
    
//             next()
    
//         }
//     } catch (error) {
//         return next(createHttpError(400,'Invalid oldPassword'))
//     }
//     // if(isValidOldPassword){
//     //     const hashedNewPassword = await bcryptPassword(newPassword)
//     //     const hashedOldPassword = await bcryptPassword(oldPassword)

//     //     const _reqPassword = req as PasswordAuthRequest
//     //     _reqPassword.userOldPassword = hashedOldPassword
//     //     _reqPassword.userNewPassword = hashedNewPassword

//     //     console.log('midleware change password _reqPassword.userOldPassword',_reqPassword.userOldPassword);
//     //     console.log('midleware change password _reqPassword.userNewPassword',_reqPassword.userNewPassword);

//     //     console.log(_reqPassword.userNewPassword === _reqPassword.userOldPassword);
        
//     //     console.log('# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  ##  # # #  ');
        

//     //     next()

//     // }else{
//     //     return next(createHttpError(400,'Invalid oldPassword'))
//     // }
//     // const _reqPassword = req as AdminAuthRequest

//     // _req.userOldPassword = hashedOldPassword 
//     // _req.userNewPassword = hashedNewPassword

//     // _reqPassword.userOldPassword = hashedOldPassword as string
//     // _reqPassword.userNewPassword = hashedNewPassword as string
//     // next()
// }

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const userId = (req as AuthRequest).userId;
    const userRole = (req as AuthRequest).userRole
    const hashedOldPassword = await bcryptPassword(oldPassword);

    try {
        const user = await Admin.findById(userId);
        console.log('USER : ',user);
        
        if (!user) {
            return next(createHttpError(400, 'Invalid User'));
        }
        if((user.role === userRole) ){
            const isPasswordCorrect = await bcryptComparePassword(oldPassword,user.password)
                
            if(!isPasswordCorrect){
 
                return next(createHttpError(400, 'Invalid Request'));
            }
        }else{
            return next(createHttpError(400, 'Invalid token'));
        }


        // const isValidOldPassword = await bcryptComparePassword(oldPassword, user.password);
        // if (!isValidOldPassword) {
        //     return next(createHttpError(400, 'Invalid oldPassword'));
        // }

        
        const hashedNewPassword = await bcryptPassword(newPassword);

        const reqPassword = req as PasswordAuthRequest;
        reqPassword.userOldPassword = hashedOldPassword;
        reqPassword.userNewPassword = hashedNewPassword;

        // console.log('middleware change password reqPassword.userOldPassword', reqPassword.userOldPassword);
        // console.log('middleware change password reqPassword.userNewPassword', reqPassword.userNewPassword);

        next();

    } catch (error) {
        return next(createHttpError(500, 'Internal Server Error'));
    }
};

export default changePassword