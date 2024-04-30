// express setup

import express, { NextFunction, Request, Response } from "express"
import globalErrorHandler from "./middlewares/globalErrorHanlder"



const app = express()


app.use(express.json({limit:'16kb'}))
app.use(express.static('public'))


// Routes
app.get('/api/v1',(req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({
        message:"Welcome to TechNote"
    })
})



app.use(globalErrorHandler)
export default app