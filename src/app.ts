// express setup

import express, { NextFunction, Request, Response } from "express"
import globalErrorHandler from "./middlewares/globalErrorHanlder"
import adminRouter from "./admin/admin.Routes"
import productRouter from "./products/product.Routes"



const app = express()


app.use(express.json({limit:'16kb'}))
app.use(express.static('public'))


// Routes
app.get('/api/v1',(req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({
        message:"Welcome to TechNote"
    })
})

// admin router
app.use('/api/v1/admin',adminRouter)

// product router
app.use('api/v1/product',productRouter)

//  Global error handler
app.use(globalErrorHandler)
export default app