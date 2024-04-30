import app from "./src/app";
import { config } from "./src/config/config";

const startServer = async ()=>{
    // connect database

    const port = config.port

    app.listen(port,()=>{
        console.log(`Sever is running on Port ${port}`);
        
    })

}

startServer()