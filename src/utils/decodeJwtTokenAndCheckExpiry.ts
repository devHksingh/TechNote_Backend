import jwt, { JwtPayload, sign } from 'jsonwebtoken'
import { config } from '../config/config'
import { genrateAccessToken, genrateRefreshToken } from './jwtAccessToken'

const decodeAccessTokenAndCheckExpiry = (token:string,tokenPayload:{})=>{
    try {
        const decodedToken = jwt.verify(token,config.jwtAccessSecret as string)
        if(!decodedToken){
            return {isInvalid:true,message:'Invalid Token'}
        }
        return {isTokenExp:false, message:"Token not expired",accessToken:`Bearer ${token}`}
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            const newAccessToken = genrateAccessToken(tokenPayload)
            return {isTokenExp:true,message:'New access token',accessToken:`Bearer ${newAccessToken}`}
        }
    }
    // if(!decodedToken){
    //     return {isInvalid:true, message:'Invalid Token'}
    // }
    // const payload = decodedToken as JwtPayload
    // const payloadExp = payload.exp
    // check expiry
    // if(payloadExp){
    //     const isExpiredAccessToken = Date.now() >= payloadExp *1000
    //     if(isExpiredAccessToken){
    //         const newAccessToken = sign(tokenPayload,config.jwtAccessSecret as string ,{expiresIn:'2d', algorithm:"HS256",}) 
    //         return {isTokenExp:true,message:'New access token',accessToken:`Bearer ${newAccessToken}`}
    //     }
    //     return {isTokenExp:false,message:"Token not expired",accessToken:`Bearer ${token}`}
    //     // return { isTokenExp: false, message: "Token not expired", accessToken: `Bearer ${newAccessToken}` };

    // }

}


const decodeRefreshTokenAndCheckExpiry = (token:string,tokenPayload:{})=>{
    try {
        const decodedToken = jwt.verify(token,config.jwtRefreshSecret as string)
        if(!decodedToken){
            return {isInvalid:true,message:'Invalid Token'}
        }
        return {isTokenExp:false, message:"Token not expired",refreshToken:`Bearer ${token}`}
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            const newRefreshToken = genrateRefreshToken(tokenPayload) 
            return {isTokenExp:true,message:'New refresh token',refreshToken:`Bearer ${newRefreshToken}`}
        }
    }
    

}

export {
    decodeAccessTokenAndCheckExpiry,
    decodeRefreshTokenAndCheckExpiry,
}