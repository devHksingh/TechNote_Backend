import { config as conf } from "dotenv";

conf()

const _config = {
   port:process.env.PORT || 3000, 
   dataBaseUrl:process.env.MONGODB_URL,
   env: process.env.NODE_ENV,
   jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
   jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
   cloudinaryCloudName:process.env.CLOUDINARY_CLOUD_NAME,
   cloudinaryApiKey:process.env.CLOUDINARY_CLOUD_API_KEY,
   cloudinaryApiSecret:process.env.CLOUDINARY_CLOUD_API_SECRET,

   userAvatarUrl:process.env.USER_AVATAR_URL,
   productImgId:process.env.PRODUCT_IMG_ID,
}

export const config = Object.freeze(_config)