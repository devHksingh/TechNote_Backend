import { sign } from "jsonwebtoken";
import { config } from "../config/config";


export default function genrateRefreshToken(payload:{}){
    const refreshToken = sign(payload,config.jwtRefreshSecret as string,{expiresIn:'7d',algorithm:"HS256"})
    return refreshToken
}