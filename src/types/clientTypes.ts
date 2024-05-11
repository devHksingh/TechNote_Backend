import { TaskInterface } from "./taskTypes";

export interface TestClientInterface{
    _id:string;
    name:string;
    email:string;
    password:string;
    avatar:string;
    role:string;
    taskHistory:TaskInterface;
    refreshToken:string;
    createdAt:Date;
    updatedAt:Date;
}