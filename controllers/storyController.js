
import client from "../config/imageKit.js";
import Story from "../models/Story.js";
import fs from "fs"
import User from "../models/User.js";
export const addStory=async(req,res)=>{
  try{
const {userId}=req.auth();
const {media_type,content,background_color}=req.body;
const media=req.files.story && req.files.story[0];
let url='';
if(media_type=='video' || media_type=='image')
{
const buffer=fs.createReadStream(media.path);
const response=await client.files.upload({
  file:buffer,
  fileName:media.originalname
})
url=response.url
}
await Story.create({
user:userId,
media_type,
media_url:url,
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

//get user stories

export const getUserStory=async(req,res)=>{
  try{
 const {userId}=req.auth();
 const user=await User.findById(userId);
 //user connections and follwings
 const userids=[userId,...user.connections,...user.following]
 const stories=await Story.find({
  user:{
    $in:userids
  }
 }).populate('user').sort({createdAt:-1})
 res.json({
  stories,
  success:true,
  message:"Story fetched successfully"
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

