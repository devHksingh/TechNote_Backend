import bcrypt from 'bcryptjs'

async function  bcryptPassword(passowrd:string){
    const hashedPassword= await bcrypt.hash(passowrd,10)
    return  hashedPassword
}

export default bcryptPassword