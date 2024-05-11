import { TaskInterface } from "./taskTypes";


export interface UserInterface {
    _id:string,
    name:string,
    email:string,
    password:string,
    avatar:string,
    taskHistory:TaskInterface,
    role:string,
    refreshToken:string,
    createdAt:Date;
    updatedAt:Date;
}