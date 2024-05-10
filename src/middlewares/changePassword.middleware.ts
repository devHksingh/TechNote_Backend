import { NextFunction, Request, Response } from "express"
import bcryptPassword, { bcryptComparePassword } from "../utils/bcrytHashpasword"
import createHttpError from "http-errors"
import { AuthRequest } from "./authenticate";
import { Admin } from "../admin/admin.Model";
import { Employee } from "../employee/employee.Model";
import { Client } from "../client/client.Model";




export interface PasswordAuthRequest extends Request{
    userOldPassword:string;
    userNewPassword:string;

}

const changePassword = async(req: Request, res: Response, next: NextFunction)=>{
    const {oldPassword,newPassword} = req.body
    console.log('----------------------------MIDDLEWARE START -----------------------------');
    
    console.log(oldPassword,newPassword);

    const reqUserInfo = req as AuthRequest
    const userId = reqUserInfo.userId
    const userRole = reqUserInfo.userRole

    const hashedOldPassword = await bcryptPassword(oldPassword);
    console.log('Middleware hashedOldPassword : ',hashedOldPassword);

    console.log(userId,userRole);

    if (!userId || !userRole) {
        return next(createHttpError(400,'INVALID TOKEN INFO'))
        
    }
    if(!(userRole === 'Admin' || 'Client' || 'Manager' || 'Technician' || 'Tech_support')){
        return next(createHttpError(400,'Invalid userRole'))
    }
    
    let user
    if(userRole === 'Admin'){
        try {
            user = await Admin.findById(userId)
        } catch (error) {
            return next(createHttpError(400,'unable to fetch user details'))
        }
    }
    if(userRole === 'Client'){
        try {
            user = await Client.findById(userId)
        } catch (error) {
            return next(createHttpError(400,'unable to fetch user details'))
        }
    }
    if(userRole === 'Manager'||'Technician'||'Tech_support'){
        try {
            user = await Employee.findById(userId)
        } catch (error) {
            return next(createHttpError(400,'unable to fetch user details'))
        }
    }

    if(user){

        const isPasswordCorrect = await bcryptComparePassword(oldPassword,user.password)
        console.log('MiddleWare isPasswordCorrect : ',isPasswordCorrect);
                    
        if(!isPasswordCorrect){

            return next(createHttpError(400, 'Invalid old password'));
        }

        const hashedNewPassword = await bcryptPassword(newPassword);
    
        const reqPassword = req as PasswordAuthRequest;
        reqPassword.userOldPassword = hashedOldPassword;
        reqPassword.userNewPassword = hashedNewPassword;

        console.log('Middleware Req Hashed Old Password : ',reqPassword.userOldPassword);
        console.log('Middleware Req Hashed NEW Password : ',reqPassword.userNewPassword);
        
        

        next();
        
    }
    



    
}

// const changePassword = async (req: Request, res: Response, next: NextFunction) => {
//     const { oldPassword, newPassword } = req.body;
//     console.log('Middleware Old :' ,oldPassword);
//     console.log('Middleware NEW :' ,newPassword);
    
//     const userId = (req as AuthRequest).userId;
//     const userRole = (req as AuthRequest).userRole
//     const hashedOldPassword = await bcryptPassword(oldPassword);
//     console.log('Middleware hashedOldPassword : ',hashedOldPassword);
    
//     let userModel: typeof Admin | typeof Client | typeof Employee;
//     let user1
//     if(userRole === 'Admin') { 
//         // userModel = Admin
//         user1 = await Admin.findById(userId)
//     }else if(userRole === 'Client'){
//         // userModel = Client
//         user1 = await Client.findById(userId)
//     }else if(userRole === 'Manager'||'Technician'||'Tech_support'){
//         // userModel = Employee
//         user1 = await Employee.findById(userId)
//     }else{
//         return next(createHttpError(400,'Invalid Info'))
//     }

//     //
    
//         try {
//             // const user = await userModel.findById(userId); 
//             const user = user1
//             console.log('Middleware USER : ',user);
            
//             if (!user) {
//                 return next(createHttpError(400, 'Invalid User'));
//             }
//             if((user.role === userRole) ){
//                 const isPasswordCorrect = await bcryptComparePassword(oldPassword,user.password)
//                   console.log('MiddleWare isPasswordCorrect : ',isPasswordCorrect);
                    
//                 if(!isPasswordCorrect){
     
//                     return next(createHttpError(400, 'Invalid Request'));
//                 }
                
//             }else{
//                 return next(createHttpError(400, 'Invalid token'));
//             }
    
            
//             const hashedNewPassword = await bcryptPassword(newPassword);
    
//             const reqPassword = req as PasswordAuthRequest;
//             reqPassword.userOldPassword = hashedOldPassword;
//             reqPassword.userNewPassword = hashedNewPassword;

//             console.log('Middleware Req Hashed Old Password : ',reqPassword.userOldPassword);
//             console.log('Middleware Req Hashed NEW Password : ',reqPassword.userNewPassword);
            
            
    
//             next();
//             console.log('HI');
            
    
//         } catch (error) {
//             return next(createHttpError(500, 'Internal Server Error'));
//         }
    
    
    
// };

export default changePassword


// async function dbCall(){
//     try {
//         const user = await userModel.findById(userId);
//         console.log('USER : ',user);
        
//         if (!user) {
//             return next(createHttpError(400, 'Invalid User'));
//         }
//         if((user.role === userRole) ){
//             const isPasswordCorrect = await bcryptComparePassword(oldPassword,user.password)
                
//             if(!isPasswordCorrect){
 
//                 return next(createHttpError(400, 'Invalid Request'));
//             }
//         }else{
//             return next(createHttpError(400, 'Invalid token'));
//         }


//         // const isValidOldPassword = await bcryptComparePassword(oldPassword, user.password);
//         // if (!isValidOldPassword) {
//         //     return next(createHttpError(400, 'Invalid oldPassword'));
//         // }

        
//         const hashedNewPassword = await bcryptPassword(newPassword);

//         const reqPassword = req as PasswordAuthRequest;
//         reqPassword.userOldPassword = hashedOldPassword;
//         reqPassword.userNewPassword = hashedNewPassword;

//         // console.log('middleware change password reqPassword.userOldPassword', reqPassword.userOldPassword);
//         // console.log('middleware change password reqPassword.userNewPassword', reqPassword.userNewPassword);

//         next();

//     } catch (error) {
//         return next(createHttpError(500, 'Internal Server Error'));
//     }
// }