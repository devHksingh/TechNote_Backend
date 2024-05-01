import { TaskInterface } from "./taskTypes";

export interface ClientInterface{
    _id:string;
    name:string;
    email:string;
    password:string;
    avatar:string;
    refreshToken:string;
    createdAt:Date;
    updatedAt:Date;
    task:TaskInterface;
}