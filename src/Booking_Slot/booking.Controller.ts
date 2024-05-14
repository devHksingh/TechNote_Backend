import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/authenticate";
import createHttpError from "http-errors";
import { Booking } from "./booking.Model";
import { Client } from "../client/client.Model";
import { Admin } from "../admin/admin.Model";
import { Employee } from "../employee/employee.Model";




const bookSlot = async (req:Request,res:Response,next:NextFunction)=>{

    const {date,timeSlot,clientName,clientEmail} = req.body
    const _req = req as AuthRequest
    const id = _req.userId
    const role = _req.userRole
    let bookingStatus
    const validTimeSlot = ['10am-11am', '11am-12pm', '12pm-1pm', '1pm-2pm', '2pm-3pm', '3pm-4pm', '4pm-5pm', '5pm-6pm', '6pm-7pm']
    
    if(!(validTimeSlot.includes(timeSlot))){
        return next(createHttpError(400,'Please select proper time slot'))
    }

    
    const weeklyOffDay = 4
    let user
    let userName
    let userEmail

    // console.log('date$$$',date,currentDate);
    
    // isValidDate

    const currentDate = new Date().getDate()
    const currentDay = new Date().getDay()
    const currentMonth = new Date().getMonth() +1
    const currentYear = new Date().getFullYear()

    const userDate = parseInt(date.split('/').at(0))
    const userMonth = parseInt(date.split('/').at(1))
    const userYear = parseInt(date.split('/').at(2))

   // check for if booking request on weekly off day
   if((currentDay === weeklyOffDay)){
        
        return next(createHttpError(400,'Slots cannot be booked on Tuesdays.'))
     
   }else if(!((userDate>= currentDate)&&(userMonth>= currentMonth)&&(userYear>=currentYear))){
        console.log('hi');
        
    //ensures that users can only select date for today's date or future dates
         return next(createHttpError(400,'You cannot book a slot for a date in the past. Please choose a date from today onwards.'))
   }    

    //query to check available slots for a specific date and time

    if(role === 'Admin' || role === 'Manager'||role === 'Technician'||role === 'Tech_support'|| role === 'Client'){
        console.log(role);
        
        bookingStatus = await Booking.findOne({date,timeSlot,isAvailable:false})
        console.log('------------------------------------###################');
        
        console.log(bookingStatus);
        
        // console.log(bookingStatus === false);
        if(!bookingStatus){
            console.log('not avaiable');

            if(role === 'Client' ){
                // check if id valid or not  and get detail
                user = await Client.findById(id).select("-password -refreshToken")
                if(!user){
                    return next(createHttpError(400,'Unauthrize token'))
                }
            }else if(role === 'Admin'){
                // check if token id valid or not 
                user = await Admin.findById(id).select("-password -refreshToken")
                if(!user){
                    return next(createHttpError(400,'Unauthrize token'))
                }
            }else{
                // check if token id valid or not 
                user = await Employee.findById(id).select("-password -refreshToken")
                if(!user){
                    return next(createHttpError(400,'Unauthrize token'))
                }
            }
            try {
                if ((role === 'Client') ){
                    userName = user.name
                    userEmail = user.email
                }else{
                    userName = clientName 
                    userEmail = clientEmail 
                    
                }
                bookingStatus = await Booking.create({
                    date:date,
                    timeSlot:timeSlot,
                    isAvailable:false,
                    applicantName:userName || "Unknown",
                    applicantEmail:userEmail || "Unknown"
                })
                console.log(bookingStatus);
                
            } catch (error) {
                console.log(error);
                
                return next(createHttpError(500,'Error occured while booking a slot'))
            }

        }else{
            return next(createHttpError(404,'Slot not available for booking. Try another date or time'))
        }
        
    }else{
       return next(createHttpError(400,'Unauthorize request'))
    }

    return res.status(200).json({msg:`Slot Booked at ${bookingStatus.date}, ${bookingStatus.timeSlot} `})

}

// return all booked slot at given date

const getSingleDateOccupiedTimeslots = async (req:Request,res:Response,next:NextFunction)=>{

    const date = req.params.date
    console.log(date);
    const queryDate = date.split('_').join('/')
    let timeslotsDetails
    try {
        timeslotsDetails = await Booking.find({date:queryDate})
        if(!timeslotsDetails){
            return next(createHttpError(400,'No Booking at this date'))
        }
        console.log(timeslotsDetails);
        
    } catch (error) {
        return next(createHttpError(500,'No Booking at this date'))
    }

    return res.status(200).json({
        timeslotsDetails:timeslotsDetails
    })
}

// return all booked slot


export {
    bookSlot,
    getSingleDateOccupiedTimeslots
}