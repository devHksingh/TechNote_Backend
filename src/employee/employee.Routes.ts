import express from 'express'
import { upload } from '../middlewares/multer.middleware'
import { changeCurrentPassword, createEmployee, deleteEmployee, getEmployeeList, getSingleEmployeeDetails, loginEmployee, logoutEmployee } from './employee.Controller'
import authenticate from '../middlewares/authenticate'
import { employeeRegisterSchema } from './employeeRegisterSchema'
import validate_Employee_req_schema from '../middlewares/validate_Express_Validator_schema'
import { employeeLoginSchema } from './employee_login_schema'
import { employeeLogoutSchema } from './employee_logOut_schema'
import changePassword from '../middlewares/changePassword.middleware'
import { employeePasswordChangeSchema } from './employee_PasswordChange_Schema'
import { expressLogoutSchema } from '../middlewares/Express_Validation/express_logout_schema'
import { expressLoginSchema } from '../middlewares/Express_Validation/express_login_schema'

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
    // employeeLoginSchema,
    expressLoginSchema,
    validate_Employee_req_schema, 
    loginEmployee
)

employeeRouter.post(
    '/logout',
    expressLogoutSchema,
    // employeeLogoutSchema,
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

employeeRouter.get(
    '/',
    authenticate,
    getEmployeeList
)

employeeRouter.get(
    '/:employeeId',
    authenticate,
    getSingleEmployeeDetails
)

employeeRouter.delete(
    '/:employeeId',
    authenticate,
    deleteEmployee
)


export default employeeRouter