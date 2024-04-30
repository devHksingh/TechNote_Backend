import mongoose from 'mongoose'
import { config } from './config';

const connectDB = async()=>{
    try {
        mongoose.connection.on('connected',()=>{
            console.log("connected to database successfully");
            
        })

        mongoose.connection.on('error',(err)=>{
            console.log('Error in connecting to dataBase',err)
        })

        await mongoose.connect(config.dataBaseUrl as string)
        
    } catch (error) {
        console.error('Falied to connect to Database ')
        process.exit(1)
    }
}

export default connectDB