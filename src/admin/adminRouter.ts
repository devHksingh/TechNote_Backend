import express from 'express'
import { createAdmin, loginAdmin, logoutAdmin } from './adminController'

const  adminRouter = express.Router()

// routes

adminRouter.post('/register',createAdmin)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/logout',logoutAdmin)

export default adminRouter