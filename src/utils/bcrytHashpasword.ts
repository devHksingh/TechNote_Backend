import bcrypt from 'bcryptjs'

async function  bcryptPassword(password:string){
    
    const hashedPassword= await bcrypt.hash(password,10)
    
    return  hashedPassword
}

export default bcryptPassword