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
                clientDetail:[],
                // bookSlot:""


            }) 
            console.log('Task',newTask._id);
            console.log('Task',newTask);
            
        } catch (error) {
            console.log(error);
            
            return next(createHttpError(500,'UNABLE TO CREATE TASK'))
        }
    }else{
        return next(createHttpError(400,'Unauthorize request'))
    }
    
    
    return res.status(200).json({msg:'ticket raise'})
}

const getAllTask = async(req:Request,res:Response,next:NextFunction)=>{

    const _req = req as AuthRequest
    const role = _req.userRole
    let taskList
    if(role === 'Admin' || role === 'Manager'||role === 'Technician'||role === 'Tech_support'){
        try {
            taskList = await Task.find({})
        } catch (error) {
            return next(createHttpError(500,'Unable to fetch task list.try it again!'))
        }
    }else{
        return next(createHttpError(400,'Unauthorize request'))
    }

    return res.status(200).json({taskList:taskList})
}

const getSingleTaskDetail = async(req:Request,res:Response,next:NextFunction)=>{
    const taskId = req.params.taskId
    let taskDetail
    try {
        taskDetail = await Task.findById({_id:taskId})
    } catch (error) {
        return next(createHttpError(500,'Unable to fetch task list.try it again!'))
    }

    return res.status(200).json({taskDetail:taskDetail})
}

const updateStatusFlag = async(req:Request,res:Response,next:NextFunction)=>{
    const taskId = req.params.taskId
    const _req = req as AuthRequest
    const role = _req.userRole
    const {status} = req.body
    console.log(status);
    

    if(role === 'Admin' || role === 'Manager'||role === 'Technician'||role === 'Tech_support'){
        try {
            const task = await Task.findById({_id:taskId})
            console.log(task);
            if(task){
                                
                task.StatusFlag = status
                await task.save({validateBeforeSave:false})
                console.log(task.StatusFlag);
                
            }else{
                return next(createHttpError(400,'Wrong id.try it again!'))
            } 
        } catch (error) {
            return next(createHttpError(500,'Unable to update StatusFlag.try it again!'))
        }
    }else{
        return next(createHttpError(400,'Unauthorize request'))
    }
    return res.status(200).json({StatusFlag:status})
}   

// update paymentStatus > chnage remaingPayment amount ["paid", "unpaid", "partial paid"]

const updatePaymentStatus = async(req:Request,res:Response,next:NextFunction)=>{
    const taskId = req.params.taskId
    const _req = req as AuthRequest
    const role = _req.userRole
    const {paymentStatus,remaingPaymentAmount} = req.body
    console.log(paymentStatus);
    

    if(role === 'Admin' || role === 'Manager'||role === 'Technician'||role === 'Tech_support'){
        try {
            const task = await Task.findById({_id:taskId})
            console.log(task);
            if(task){
                                
                task.paymentStatus = paymentStatus
                task.remaingPayment = remaingPaymentAmount
                await task.save({validateBeforeSave:false})
                console.log(task.StatusFlag);
                
            }else{
                return next(createHttpError(400,'Wrong id.try it again!'))
            } 
        } catch (error) {
            return next(createHttpError(500,'Unable to update StatusFlag.try it again!'))
        }
    }else{
        return next(createHttpError(400,'Unauthorize request'))
    }
    return res.status(200).json({StatusFlag:paymentStatus})
}

export {
    createTask,
    getAllTask,
    getSingleTaskDetail,
    updateStatusFlag,
    updatePaymentStatus
}