import express from 'express'
import { upload } from '../middlewares/multer.middleware'
import { changeCurrentPassword, createEmployee, loginEmployee, logoutEmployee } from './employee.Controller'
import authenticate from '../middlewares/authenticate'
import { employeeRegisterSchema } from './employeeRegisterSchema'
import validate_Employee_req_schema from '../middlewares/validate_Express_Validator_schema'
import { employeeLoginSchema } from './employee_login_schema'
import { employeeLogoutSchema } from './employee_logOut_schema'
import changePassword from '../middlewares/changePassword.middleware'
import { employeePasswordChangeSchema } from './employee_PasswordChange_Schema'

const employeeRouter = express.Router()

// routes

// file store on local by multer

employeeRouter.post(
    '/register',
    upload.fields([
        {name:'avatar',maxCount:1}
    ]),
    employeeRegisterSchema,
    validate_Employee_req_schema,
    authenticate,
    createEmployee
)

employeeRouter.post(
    '/login',
    employeeLoginSchema,
    validate_Employee_req_schema, 
    loginEmployee
)

employeeRouter.post(
    '/logout',
    employeeLogoutSchema,
    validate_Employee_req_schema,
    logoutEmployee
)

employeeRouter.post(
    "/changePassword",
    employeePasswordChangeSchema,
    validate_Employee_req_schema,
    authenticate, 
    changeCurrentPassword
)


export default employeeRouter