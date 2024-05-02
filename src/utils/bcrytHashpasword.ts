import bcrypt from 'bcryptjs'

async function  bcryptPassword(password:string){
    console.log(password);
    
    const hashedPassword= await bcrypt.hash(password,10)
    console.log(hashedPassword);
    
    return  hashedPassword
}

export default bcryptPassword