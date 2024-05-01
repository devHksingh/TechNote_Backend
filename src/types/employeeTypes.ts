import { TaskInterface } from "./taskTypes";

enum Role {
    Manager = "manager",
    Technician = "technician",
    TechSupport = "tech_support"
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