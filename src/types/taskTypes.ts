
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
    paymentStatus:string;
    createdAt:Date;
    updatedAt:Date;
}