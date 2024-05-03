import {v2 as cloudinary} from 'cloudinary';
import fs from 'node:fs'
import { config } from '../config/config';
          
cloudinary.config({ 
  cloud_name:config.cloudinaryCloudName , 
  api_key:config.cloudinaryApiKey , 
  api_secret:config.cloudinaryApiSecret    
});



const uploadOnCloudinary = async(localFilePath:string,folderName:string) => {
  try {

    if(!localFilePath) return null
    console.log(localFilePath);
    const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto",
        folder:folderName,
        
    })
    // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response.url;
    
    
  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    console.log(error)
    return null;
  }
}

export  {uploadOnCloudinary}