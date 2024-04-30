import { config as conf } from "dotenv";

conf()

const _config = {
   port:process.env.PORT || 3000, 
   dataBaseUrl:process.env.MONGODB_URL,
   
}

export const config = Object.freeze(_config)