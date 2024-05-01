import express from 'express'
import { createAdmin, loginAdmin, logoutAdmin } from './adminController'
import { adminRegisterSchema } from './admin_register_schema'
import validate_Admin_req_schema from '../middlewares/validate_Admin_register_req_schema'

const  adminRouter = express.Router()

// routes

adminRouter.post('/register',
                adminRegisterSchema,
                validate_Admin_req_schema,
                createAdmin)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/logout',logoutAdmin)

export default adminRouter