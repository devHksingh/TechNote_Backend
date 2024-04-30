import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const startServer = async ()=>{
    // connect database
    await connectDB()
    const port = config.port

    app.listen(port,()=>{
        console.log(`Sever is running on Port ${port}`);
        
    })

}

startServer()