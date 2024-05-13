import express from 'express'
import { createTask, getAllTask, getSingleTaskDetail, updateStatusFlag } from './task.Controller'
import authenticate from '../middlewares/authenticate'

const tasksRouter = express.Router()



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
tasksRouter.patch(
    '/updateStatusFlag/:taskId',
    authenticate,
    updateStatusFlag
)

export default tasksRouter