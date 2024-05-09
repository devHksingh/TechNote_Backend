import express from 'express'


const employeeRouter = express.Router()

// routes

// file store on local by multer

employeeRouter.post('/register',(req,res,next)=>{
    res.status(200).json({message:"Employee is created"})
})


export default employeeRouter