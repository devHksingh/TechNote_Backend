import { NextFunction, Request, Response } from "express";
import { Task } from "./tasks.Model";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";

/*
initail value
StatusFlag: 'pending'{in progress,completed}

*/
/*
enum values
category: 'Routine'| 'Corrective'|'Emergency'|'Overhaul'| 'Upgrades/Modifications'
Priority flags: 'Normal'|'High'|'Emergency'

Manager = "Manager",
    Technician = "Technician",
    TechSupport = "Tech_support"
*/

function isValidInput(input: string): boolean {
    return /^\d+(\.\d+)?$/.test(input) && parseFloat(input) >= 0;
}

const createTask = async (req:Request,res:Response,next:NextFunction)=>{
    const {title,description,PriorityFlag,category,estimateCost,advancePaymentPaid,paymentStatus,clientDetail} = req.body
// title,description,StatusFlag,PriorityFlag,category,estimateCost,taxAmount*,finalTotalCost*,advancePaymentPaid
//remaingPayment*,paymentStatus,assignEmployee,clientDetail
    const _req = req as AuthRequest
    const id = _req.userId
    const role = _req.userRole

    // check valid input is pass

    if(!(isValidInput(estimateCost)&& isValidInput(advancePaymentPaid))){
        return next(createHttpError(400,'Invalid input type'))
    }

    if(role === 'Admin' || role === 'Manager'||role === 'Technician'||role === 'Tech_support'){
        const cost = parseInt(estimateCost)

        const taxAmount = "5"
        let totalAmountPayable = (cost +(cost*parseInt(taxAmount)/100))
        
        totalAmountPayable = totalAmountPayable - parseInt(advancePaymentPaid)
        
        try {
            const newTask = await Task.create({
                title,
                description,
                StatusFlag:"Pending",
                PriorityFlag,
                taxAmount,
                category,
                estimateCost,
                advancePaymentPaid,
                remaingPayment:totalAmountPayable,
                paymentStatus,
                assignEmployee:[],
                clientDetail:[]


            }) 
            console.log('Task',newTask._id);
            console.log('Task',newTask);
            
        } catch (error) {
            console.log(error);
            
            return next(createHttpError(400,'UNABLE TO CREATE TASK'))
        }
    }else{
        return next(createHttpError(400,'Unauthorize request'))
    }
    
    
    return res.status(200).json({msg:'ticket raise'})
}


export {
    createTask
}