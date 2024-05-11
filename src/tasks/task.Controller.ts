import { NextFunction, Request, Response } from "express";
import { Task } from "./tasks.Model";
import createHttpError from "http-errors";



const createTask = async (req:Request,res:Response,next:NextFunction)=>{
    const {title,description,flag,category} = req.body
    
    try {
        const newTask = await Task.create({
            title,
            description,
            flag,
            category
        }) 
        console.log('Task',newTask._id);
        console.log('Task',newTask);
        
    } catch (error) {
        return next(createHttpError(400,'UNABLE TO CREATE TASK'))
    }
    return res.status(200).json({msg:'ticket raise'})
}


export {
    createTask
}