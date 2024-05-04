import bcrypt from 'bcryptjs'

async function  bcryptPassword(password:string){
    
    const hashedPassword= await bcrypt.hash(password,10)
    
    return  hashedPassword
}

export default bcryptPassword


export async function bcryptComparePassword(password:string,registerUserPassword:string){
    const isMatchPassword = await bcrypt.compare(password,registerUserPassword)
    return isMatchPassword
}