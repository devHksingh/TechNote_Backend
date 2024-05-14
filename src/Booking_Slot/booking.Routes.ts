import express from 'express'
import authenticate from '../middlewares/authenticate'
import { bookSlot } from './booking.Controller'


const bookSlotRouter = express.Router()

bookSlotRouter.post(
    '/bookSlot',
    authenticate,
    bookSlot
)

export default bookSlotRouter