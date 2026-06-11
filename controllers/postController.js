

import fs from 'fs'
import { upload } from '../config/multer';
import ImageKit from '@imagekit/nodejs';

//add post
export const addPost=async(req,res)=>{
  try{

    const {userId}=req.auth();
    const {content,post_type}=req.body;
    const images=req.files
    let image_urls=[]
if(images.length)
{
  image_urls=await Promise.all(
    images.map(async(image)=>{
   const fileBuffer=fs.readFileSync(image.path)
       const response=await  imageKit.upload({
      file:buffer,
      fileName:profile.originalNmae,

    })
    })
  )
}
  }
  catch(err)
  {
    return res.json({
      
    })
  }
}