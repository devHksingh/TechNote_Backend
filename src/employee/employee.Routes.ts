import express from 'express'
import { upload } from '../middlewares/multer.middleware'
import { createEmployee } from './employee.Controller'
import authenticate from '../middlewares/authenticate'
import { employeeRegisterSchema } from './employeeRegisterSchema'
import validate_Employee_req_schema from '../middlewares/validate_Express_Validator_schema'

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


export default employeeRouter