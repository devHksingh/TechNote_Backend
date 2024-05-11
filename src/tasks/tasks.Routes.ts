import express from 'express'
import { createTask } from './task.Controller'

const tasksRouter = express.Router()


tasksRouter.get('/',(req,res,next)=>{
    return res.status(200).json({msg:"OK"})
})

tasksRouter.post(
    '/create',
    createTask

)


export default tasksRouter