import { sign } from "jsonwebtoken";
import { config } from "../config/config";



const genrateAccessToken = (payload:{}) => {
    const accessToken = sign(payload,config.jwtAccessSecret as string,{expiresIn:'7d',algorithm:"HS256"})
    return accessToken
}

export default genrateAccessToken