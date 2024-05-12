import express from 'express'
import { createTask } from './task.Controller'
import authenticate from '../middlewares/authenticate'

const tasksRouter = express.Router()


tasksRouter.get('/',(req,res,next)=>{
    return res.status(200).json({msg:"OK"})
})

tasksRouter.post(
    '/create',
    authenticate,
    createTask
)


export default tasksRouter