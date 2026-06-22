
import client from "../config/imageKit.js";
import Story from "../models/Story.js";
import fs from "fs"
import User from "../models/User.js";
import { inngest } from "../inngest/index.js";
export const addStory=async(req,res)=>{
  try{
const {userId}=req.auth();
const {media_type,content,background_color}=req.body;
const media=req.file;

let url='';
if(media_type==='video' || media_type==='image')
{
const buffer=fs.createReadStream(media.path);
const response=await client.files.upload({
  file:buffer,
  fileName:media.originalname
})
url=response.url
}
let story=await Story.create({
user:userId,
media_type,
media_url:url,
content,
background_color
})

story= await story.populate('user');
await inngest.send({
  name:'app/story.delete',
  data:{storyId:story._id}
})
res.json({
  success:true,
  story,
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
 const verifiedUser=await User.find({
  is_verified:true

 })

 //user connections and follwings
 const userids=[userId,...user.connections,...user.following]
 for(const vUser of verifiedUser)
 {
  userids.push(vUser)
 }
 const stories=await Story.find({
  user:{
    $in:userids
  }
 }).populate('user view_count').sort({createdAt:-1})
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



export const handleView=async(req,res)=>{
  try{
    const {userId}= req.auth();
    const {storyId}=req.body;

    const story=await Story.findById(storyId);


    if(story.view_count.includes(userId))
    {
      return res.json({
        success:false,
        message:"Already seen."
      })
    }
  story.view_count.push(userId);
   await story.save();


   res.json({
    success:true,
    message:"Seen"
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