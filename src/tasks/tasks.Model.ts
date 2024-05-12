import mongoose, { Schema } from "mongoose";

/*
_id:string;
    title:string;
    description:string;
    Statusflag:string; [pending, in progress, completed]
    Priority flags:string
    {
        Normal Priority: These repairs require attention soon but are not urgent enough to disrupt current operations.
        High Priority: Repairs that are important and need to be addressed promptly to avoid any significant impact on operations.
        Emergency Priority: These repairs are critical and require immediate attention to prevent severe disruptions or safety hazards
    }
    category:string; Repair|Service
    {
        Routine Maintenance: Regular, planned maintenance to prevent equipment failure and ensure optimal performance.  
        Corrective Maintenance: Repairs done to fix issues identified during routine maintenance or due to equipment failure.   
        Preventive Maintenance: Proactive maintenance tasks performed to prevent potential issues and extend equipment lifespan.    
        Predictive Maintenance: Maintenance based on data analysis to predict when equipment failure might occur and perform maintenance before it happens. 
        Emergency Maintenance: Unscheduled maintenance required due to unexpected equipment failure or safety concerns.
        Overhaul: Comprehensive maintenance involving disassembly, inspection, repair, and reassembly of equipment to ensure optimal performance.
        Upgrades/Modifications: Changes made to equipment to improve performance, efficiency, or compliance with new standards or regulations.
    }
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
    StatusFlag:{
        type:String,
        
    },
    PriorityFlag:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    estimateCost:{
        type:String,
        required:true,
    },
    taxAmount:{
        type:String,
        required:true,
    },
    finalTotalCost:{
        type:String,
    },
    advancePaymentPaid:{
        type:String,
    },
    remaingPayment:{
        type:String,
    },
    paymentStatus:{
        type:String,
    },
    assignEmployee:[{
        type:Schema.Types.ObjectId,
        ref:'Employee'
    }],
    clientDetail:{
        type:Schema.Types.ObjectId,
        ref:'Client'
    }


},{timestamps:true})

export const Task = mongoose.model('Task',taskSchema)