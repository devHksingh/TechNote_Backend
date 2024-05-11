import express from 'express'
import { createUser } from './user.Controller'
import { upload } from '../middlewares/multer.middleware'



const userRouter = express.Router()


userRouter.post(
    '/register',
    upload.fields([
        {name:'avatar',maxCount:1}
    ]),
    // employeeRegisterSchema,
    // validate_Employee_req_schema,
    // authenticate,
    createUser
)

userRouter.get(
    '/',
    (req,res,next)=>{
        return res.status(200).json({msg:"ok"})
    }
)

export default userRouter