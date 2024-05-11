import mongoose, { Schema } from "mongoose";

/*
_id:string;
    title:string;
    description:string;
    flag:string;
    category:string;
    estimateCost:number;
    totalCostWithoutTax:number;
    taxAmount:number;
    finalTotalCost:number;
    advancePaymentPaid:number;
    paymentPaid:boolean;
    paymentStatus:PaymentStatus;
    assignEmployee:EmployeeInterface;
    clientDetail:ClientInterface;
    createdAt:Date;
    updatedAt:Date;
*/
const taskSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        
    },
    flag:{
        type:String,
        
    },
    category:{
        type:String,
        required:true,
    }
})

export const Task = mongoose.model('Task',taskSchema)