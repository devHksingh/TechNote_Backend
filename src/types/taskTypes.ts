// import { TestClientInterface } from "./clientTypes";
import { EmployeeInterface } from "./employeeTypes";

enum PaymentStatus {
    Paid = "Paid",
    PartialPaid = "PartialPaid",
    NotPaid = "NotPaid"
  }
export interface TaskInterface {
    _id:string;
    title:string;
    description:string;
    flag:string;
    category:string;
    estimateCost:string;
    totalCostWithoutTax:string;
    taxAmount:string;
    finalTotalCost:string;
    advancePaymentPaid:string;
    paymentPaid:string;
    paymentStatus:PaymentStatus;
    assignEmployee:EmployeeInterface;
    // clientDetail:ClientInterface;
    createdAt:Date;
    updatedAt:Date;
}


// const createClient = async(req:Request,res:Response,next:NextFunction)=>{

//     const {name,email,password} = req.body
//     let newClient:ClientInterface
//     let accessToken

//     // check if Client already exist ->db call
//     console.log('name,email,password :',name,email,password);
    
//     try {
        
//         const user = await Client.findOne({email:email})
//         if(user){
//             return next(createHttpError(400,"Client already exits with this email"))
//         }
//     } catch (error) {
//         return next(createHttpError(500,"Error while getting adim details"))
//     }
    
//     // password -> hash
//     let hashedPassword =''
//     try {
//         if(password){
//             hashedPassword = await bcryptPassword(password)  
//             console.log('hashedPassword-------: ',hashedPassword);
             
//         }   
//     } catch (error) {
//         return next(createHttpError(400,"Failed to create hashed password . try it again!!"))
        
//     }

//     // upload avatar on cloudinary 

    

//     let avatarUrl 
//     if (req.files && Object.keys(req.files).length === 0) {
//         console.log('No files were uploaded');
//         console.log('avatar not found');
        
//         avatarUrl = config.userAvatarUrl
//       } else {
//         // Process the uploaded files
        
        
//         const files = req.files as { [filename:string]:Express.Multer.File[]}
        
//         const avatarLocalPath = files?.avatar[0]?.path;
        
        
//         try {
            
//             avatarUrl = await uploadOnCloudinary(avatarLocalPath,'techNote_Client_Avatar')
//             console.log('File is uploaded ------: ',avatarUrl);
            
//         } catch (error) {
//             console.log(error);

//             avatarUrl =''
//             return next(createHttpError(400,'Failed to upload to cloudinary '))
//         }
//       }
    
//     const refreshToken =   genrateRefreshToken({sub:name})
   
//       console.log('refreshToken----------: ',refreshToken);
      
    

//     try {
//         console.log('creating Client in db');
//         console.log(name,email,hashedPassword,avatarUrl,refreshToken);
        
//         newClient = await Client.create({
//             name,
//             email,
//             password:hashedPassword,
//             avatar:avatarUrl,
//             role:'Client',
//             taskHistory:[],
//             refreshToken

//         })
        
//         accessToken =  genrateAccessToken({id:newClient._id,role:'Client'})
//         console.log('--------accessToken--------:',accessToken);
        
//     } catch (error) {
        
//         return next(createHttpError(500,"Error while creating client in DB"))
//     }
//     // 
    

//     res.status(201).json({message:'Client is created successfully',accessToken:accessToken,id:newClient._id})

// }