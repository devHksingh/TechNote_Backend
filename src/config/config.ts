import { config as conf } from "dotenv";

conf()

const _config = {
   port:process.env.PORT || 3000, 
   dataBaseUrl:process.env.MONGODB_URL,
   env: process.env.NODE_ENV,
   
   cloudinaryCloud:process.env.CLOUDINARY_CLOUD_NAME,
   cloudinaryApiKey:process.env.CLOUDINARY_CLOUD_API_KEY,
   cloudinaryApiSecret:process.env.CLOUDINARY_CLOUD_API_SECRET,
}

export const config = Object.freeze(_config)