import express from 'express'
import { createTask, getAllTask, getSingleTaskDetail } from './task.Controller'
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

tasksRouter.get(
    '/',
    authenticate,
    getAllTask
)
tasksRouter.get(
    '/:taskId',
    authenticate,
    getSingleTaskDetail
)

export default tasksRouter