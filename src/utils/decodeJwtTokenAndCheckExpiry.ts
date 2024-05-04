import jwt, { JwtPayload, sign } from 'jsonwebtoken'
import { config } from '../config/config'

const decodeAccessTokenAndCheckExpiry = (token:string,tokenPayload:{})=>{
    const decodedToken = jwt.verify(token,config.jwtAccessSecret as string)
    if(!decodedToken){
        return {message:'Invalid Token'}
    }
    const payload = decodedToken as JwtPayload
    const payloadExp = payload.exp
    // check expiry
    if(payloadExp){
        const isExpiredAccessToken = Date.now() >= payloadExp *1000
        if(isExpiredAccessToken){
            const newAccessToken = sign(tokenPayload,config.jwtAccessSecret as string ,{expiresIn:'2d', algorithm:"HS256",}) 
            return {message:'New access token',accessToken:`Bearer ${newAccessToken}`}
        }
        return {message:"Token not expired",accessToken:`Bearer ${decodedToken}`}
    }

}


const decodeRefreshTokenAndCheckExpiry = (token:string,tokenPayload:{})=>{
    const decodedToken = jwt.verify(token,config.jwtRefreshSecret as string)
    if(!decodedToken){
        return {message:'Invalid Token'}
    }
    const payload = decodedToken as JwtPayload
    const payloadExp = payload.exp
    // check expiry
    if(payloadExp){
        const isExpiredRefreshToken = Date.now() >= payloadExp *1000
        if(isExpiredRefreshToken){
            const newRefreshToken = sign(tokenPayload,config.jwtRefreshSecret as string ,{expiresIn:'2d', algorithm:"HS256",}) 
            return {message:'New access token',refreshToken:`Bearer ${newRefreshToken}`}
        }
        return {message:"Token not expired",refreshToken:`Bearer ${decodedToken}`}
    }

}

export default{
    decodeAccessTokenAndCheckExpiry,
    decodeRefreshTokenAndCheckExpiry,
}