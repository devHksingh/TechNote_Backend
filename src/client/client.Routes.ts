import express from 'express'
import { upload } from '../middlewares/multer.middleware'
import { clientRegisterSchema } from './client_register_schema'
import validate_Client_req_schema from '../middlewares/validate_Express_Validator_schema'
import { createClient } from './client.Controller'
// import { ClientInterface } from '../types/clientTypes'
import { Client } from './client.Model'

const clientRouter = express.Router()


clientRouter.post(
    '/register',
    upload.fields([
        {name:'avatar',maxCount:1}
    ]),
    clientRegisterSchema,
    validate_Client_req_schema,
    createClient
)

clientRouter.post('/test',
    async(req,res,next)=>{
        console.log('hi');
        const {name,email,avatar,password,role,refreshToken,taskHistory} =req.body
        console.log(name,email,avatar,password,role,refreshToken,taskHistory);
        
        
        try {
           const newClient = await Client.create({
                name,email,avatar,password,role,refreshToken,taskHistory
            })
        } catch (error) {
            console.log('error while creating client on db');
            return res.status(400).json({msg:'error while creating client on db'})
            
        }
        return res.status(200).json({name:name})
        
    }
)

// clientRouter.post('/register',(req,res,next)=>{
//     res.status(200).json({msg:"hi "})
// })


export default clientRouter