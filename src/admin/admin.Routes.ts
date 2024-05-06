import express from 'express'
import { createAdmin, loginAdmin, logoutAdmin } from './adminController'
import { adminRegisterSchema } from './admin_register_schema'
import validate_Admin_req_schema from '../middlewares/validate_Express_Validator_schema'
import { upload } from '../middlewares/multer.middleware'
import { adminLoginSchema } from './admin_login_schema'
import authenticate from '../middlewares/authenticate'
import { adminLogoutSchema } from './admin_logOut_schema'


const  adminRouter = express.Router()

// routes

// file store on local by multer



adminRouter.post('/register',
                upload.fields([
                    {name:'avatar',maxCount:1}
                ]),
                adminRegisterSchema,
                validate_Admin_req_schema,
                
                createAdmin)
adminRouter.post(
    '/login',
    adminLoginSchema,
    validate_Admin_req_schema,
    // authenticate,
    loginAdmin
)
adminRouter.post('/logout',adminLogoutSchema,validate_Admin_req_schema,logoutAdmin)

export default adminRouter