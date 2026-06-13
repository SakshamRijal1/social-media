import client from "../config/imageKit.js";
import Story from "../models/Story.js";
import fs from "fs"
export const addStory=async(req,res)=>{
  try{
const {userId}=req.auth();
const {media_type,content,background_color}=req.body;
const media=req.files.story && req.files.story[0];
const buffer=fs.createReadStream(media.path);
const response=await client.files.upload({
  file:buffer,
  fileName:media.originalname
})
await Story.create({
user:userId,
media_type,
media_url:response.url,
content,
background_color
})
res.json({
  success:true,
  message:"Story created successfully"
})


  }
  catch(err)
  {
    res.json({
      success:false,
      message:err.message
    })
  }
}

export default addStory