import express from 'express'
import { changeCurrentPassword, createAdmin, loginAdmin, logoutAdmin } from './adminController'
import { adminRegisterSchema } from './admin_register_schema'
import validate_Admin_req_schema from '../middlewares/validate_Express_Validator_schema'
import { upload } from '../middlewares/multer.middleware'
import { adminLoginSchema } from './admin_login_schema' // remove it at end of dev
import authenticate from '../middlewares/authenticate'
import { adminLogoutSchema } from './admin_logOut_schema' // remove it at end of dev
import changePassword from '../middlewares/changePassword.middleware' // remove it at end of dev
import { adminPasswordChangeSchema } from './admin_passwordChange_schema'
import { expressLoginSchema } from '../middlewares/Express_Validation/express_login_schema'
import { expressLogoutSchema } from '../middlewares/Express_Validation/express_logout_schema'


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
    // adminLoginSchema,
    expressLoginSchema,
    validate_Admin_req_schema,
    // authenticate,
    loginAdmin
)

adminRouter.post(
    "/changePassword",
    adminPasswordChangeSchema,
    validate_Admin_req_schema,
    authenticate,
    
    changeCurrentPassword
)

adminRouter.post('/logout',
    // adminLogoutSchema,
    expressLogoutSchema,
    validate_Admin_req_schema,
    logoutAdmin)

export default adminRouter