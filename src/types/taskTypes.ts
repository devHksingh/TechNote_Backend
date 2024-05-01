import { ClientInterface } from "./clientTypes";
import { EmployeeInterface } from "./employeeTypes";

enum PaymentStatus {
    Paid = "Paid",
    PartialPaid = "PartialPaid",
    NotPaid = "NotPaid"
  }
export interface TaskInterface {
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
}