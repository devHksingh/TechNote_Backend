import express from 'express'
import authenticate from '../middlewares/authenticate'
import { bookSlot, getSingleDateOccupiedTimeslots } from './booking.Controller'


const bookSlotRouter = express.Router()

bookSlotRouter.post(
    '/bookSlot',
    authenticate,
    bookSlot
)

bookSlotRouter.get(
    '/bookSlot/:date',
    authenticate,
    getSingleDateOccupiedTimeslots

)
export default bookSlotRouter