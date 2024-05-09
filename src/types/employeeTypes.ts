import { TaskInterface } from "./taskTypes";

enum Role {
    Manager = "Manager",
    Technician = "Technician",
    TechSupport = "Tech_support"
  }

export interface EmployeeInterface {
    _id:string;
    name:string;
    email:string;
    password:string;
    avatar:string;
    refreshToken:string;
    role:Role;
    salary:number;
    task:TaskInterface;
    createdAt:Date;
    updatedAt:Date;
    
}