import { sign } from "jsonwebtoken";
import { config } from "../config/config";



const genrateAccessToken = (payload:{}) => {
    const accessToken = `Bearer ${sign(payload,config.jwtAccessSecret as string,{expiresIn:'2d',algorithm:"HS256"})}`
    return accessToken
}

const genrateRefreshToken = (payload:{})=>{
    const refreshToken = `Bearer ${sign(payload,config.jwtRefreshSecret as string,{expiresIn:'7d',algorithm:"HS256"})}`
    return refreshToken
}

export  {genrateAccessToken,genrateRefreshToken}