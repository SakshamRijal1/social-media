
import User from "../models/User.js";
import fs from 'fs';


import Connection from "../models/Connection.js";
import client from "../config/imageKit.js"

export const getUserData=async(req,res)=>{
      console.log("hi")
  try{
    const {userId}=  req.auth();
    const user=await User.findById(userId);

    if(!user)
    {
      return res.json({
        success:false,
        message:"User not found"
      })
    }
    res.json({
    success:true,
    user
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

export const updateUserData=async(req,res)=>{
  try{
    const {userId}=  req.auth();
    const {username,bio,location,full_name}=req.body;
    const tempUser=await User.findById(userId);
    if(!username &&(username==tempUser.username))
    {
      return 
    }
    if(tempUser.username !==username)
    {
      const user=User.findOne({username});
      if(user)
      {
        username=tempUser.username;
        
      }
    }

  const updateData=
  {
    username,
    bio,
    location,
    full_name
  };
    const profile=req.files.profile && req.files.profile[0];
   const cover=req.files.cover && req.files.cover[0];
   if(profile)
   {
    const buffer=fs.createReadStream(profile.path);//fs is file system module in nodejs
    const response=await  client.files.upload({
      file:buffer,
      fileName:profile.originalname,

    })

    const url=client.helper.buildSrc({
  urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT,
        src:response.filePath,
      transformation:[
        {
          quatlity:"auto"},
          {format:'webp'},
          {
            width:'512'
          }
        
      ]
    })
    updateData.profile_picture=url;
   }
      if(cover)
   {
    const buffer=fs.createReadStream(cover.path);//fs is file system module in nodejs
    const response=await  client.files.upload({
      file:buffer,
      fileName:cover.originalname,

    })

    const url=client.helper.buildSrc({
  urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT,
        src:response.filePath,
      transformation:[
        {
          quality:"auto"},
          {format:'webp'},
          {
            width:'512'
          }
        
      ]
    })
    updateData.cover_photo=url;

   }
   const user=await User.findByIdAndUpdate(userId,
    updateData,
    {
      new:true,//return upadated user data
    }
   )
   res.json({
    success:true,
    user,
    message:"Profile updated successfully"

   })

}  catch(err)
  {
 res.json({
  success:false,
    message:err.message
 })
  }
}

//Find user using username,email,location,name
export const discoverUsers=async(req,res)=>{
  try{
    const {userId}=  req.auth();
const {input}=req.body;
const allUsers=await User.find({
  $or:[
    {
      username:new RegExp(input,"i")//$or means if any of the condition is true then it will return the user,i means case insesnsitive
    },
      {
      full_name:new RegExp(input,"i")
    },    {
      location:new RegExp(input,"i")
    }
  ]
})
const filterUsers=allUsers.filter((user)=>user._id!==userId);
res.json({
  success:true,
  users:filterUsers,
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
//follow user 
     export const followUsers=async(req,res)=>{
  try{
    const {userId}=  req.auth();
    const {id}=req.body;
    const user=await User.findById(userId);


    if(user.following.includes(id))
    {
      return res.json({
        success:false,
        message:"Already following the user"
      })
    }
    user.following.push(id);
    await user.save();
    const toUser=await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();
    res.json({
      success:true,
      message:"User followed successfully"
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

// unfollow user
export const unfollowUsers=async(req,res)=>{
  try{
    const {userId}= await req.auth();
    const {id}=req.body;
    const user=await User.findById(userId);
 user.following=user.following.filter((user=>user!=id));
 await user.save()
     const toUser=await User.findById(id);
 user.followers=user.followers.filter((user=>user!=userId));
 await user.save()
    res.json({
      success:true,
      message:"User unfollowed successfully"
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

export const sendConnectionRequest=async(req,res)=>{
  try{

    const {userId}= req.auth();
    const {id}=req.body;
    const last24Hours=new Date(Date.now()-24*60*60*1000);
    const connectionRequests=await Connection.find({
      from_user_id:userId,
       createdAt:{
        $gt:last24Hours
       }
    })
    if(connectionRequests.length>=20)
    {
     return res.json({
      success:false,
        message:"You have reached the limit of sending connection request"
      })
    }
    const connection=await Connection.findOne(
      {
        $or:[
          {
            to_user_id:userId, from_user_id:id
          },
          {
            to_user_id:id, from_user_id:userId
          }
        ]
      }
    )

    if(!connection)
    {
    await Connection.create({
      from_user_id:userId,
      to_user_id:id,
    })
    }
    else if(connection && connection.status=="accepted")
    {
      return res.json({
        success:false,
        message:"You both are already connected"
      })
    }
return res.json({
  success:false,
  message:"Connection request pending"
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

//get user connections
export const getUserConnections=async(req,res)=>{
  try{
const {userId}= req.auth();
const user=await User.findById(userId).populate('connections followers following');
const connections=user.connections;
const followers=user.followers;
const following=user.following;
const pendingConnections=(await Connection.find({
  to_user_id:userId,
  status:'pending'
}).populate('from_user_id')).map(connection=>connection.from_user_id)

return res.json({
  success:true,
  connections,
  followers,
  following,
  pendingConnections
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


///accept the connection request
export const acceptConnectionRequest=async(req,res)=>{
  try{
const {userId}=req.auth();
const {id}=req.body;
const connection=await Connection.findOne({
  from_user_id:id,
  to_user_id:userId
})
if(!connection)
{
  return res.json({
    success:false,
    message:"Connection not found"
  })
}
 const user=await User.findById(userId);
 user.connections.push(id);
 await user.save()
 const toUser=await User.findById(id);
 toUser.connections.push(userId)
 await toUser.save()

  }
  catch(err)
  {
    res.json({
      message:err.message,
      success:false,
    })
  }
}