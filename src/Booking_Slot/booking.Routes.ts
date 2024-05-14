import express from 'express'
import authenticate from '../middlewares/authenticate'
import { bookSlot, getAllOccupiedTimeslots, getSingleDateOccupiedTimeslots } from './booking.Controller'


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
bookSlotRouter.get(
    '/bookSlot/',
    
    getAllOccupiedTimeslots

)
export default bookSlotRouter