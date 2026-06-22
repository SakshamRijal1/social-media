
import fs from 'fs'
import client from "../config/imageKit.js";
import Message from "../models/Message.js";


// import { error } from "console";
// const connections={};//create an empty object to store server side event connections

// //controller function for the server side event endpoint

// export const sseController=(req,res)=>{
//   const {userId}=req.params;
//   console.log("New client connected", userId)
//   //set sse headers
//   res.setHeader('Content-Type','text/event-stream')
// res.setHeader('Cache-Control','no-cache')
//   res.setHeader('Access-Control-Allow-Origin','*')


//   //add the client's response object to the connections objects
//   connections[userId]=res

//   //send an initail event to the client
//   res.write('data:Connected to SSE stream \n\n')

//   //handle client disconnection
//   req.on('close',()=>{
//     //remove the clients response object from the connections array
//     delete connections[userId]
//     console.log('Client Disconnected')
//   }) 
// }


const connections={};//empty object to save the server-sent event  connections


export const sseController=async(req,res)=>{
const {userId}=req.params;
  res.setHeader('Content-Type','text/event-stream')
res.setHeader('Cache-Control','no-cache')
  res.setHeader('Access-Control-Allow-Origin','*')
  connections[userId]=res;


  res.write('data:Connected to sse stream \n\n');
  req.on('close',()=>{
   delete connections[userId];
   console.log('Client disconnected')

  })

}






//sendMessage=
// export const sendMessage=async(req,res)=>{
//   try{
//     const {userId}=req.auth();
//     const {to_user_id,text}=req.body;
//     const image=req.file;
//     let media_url=''
//     let message_type=image? 'image':'text'
//     if(message_type=='image')
//     { 
//       const buffer=fs.createReadStream(image.path);
//       const response=await client.files.upload(
//         {
//           file:buffer,
//           fileName:image.originalname
//         }
//       )


//       const media_url=client.helper.buildSrc({
//         urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT,
//         src:response.filePath,
//         transformation:[
//           {
//             quality:'auto'
//           },
//           {
//             format:'webp'
//           },
//           {
//             width:'1280'
//           }
//         ],


//       })

//      const message= await Message.create({
//         form_user_id:userId,
//         to_user_id,
//         media_url,
//         text,
//         message_type,

       
//       })

//     }
//     res.json({
//       success:true,
//       message:"Message send successfully"
//     })
//     const messageWithUserData=await Message.findById(message._id).populate('fro_user_id');
//     if(connections[to_user_id])
//     {
//       connections[to_user_id].write(`data:${JSON.stringify(messageWithUserData)}\n\n`)
//     }
    

//   }
//   catch(err)
//   {
// console.log(err);
// res.json({
//   success:false,
//   message:err.message
// })
//   }
// }

//send message
 export const sendMessage=async(req,res)=>{
  try{
const {userId}=req.auth();
const {to_user_id,text}=req.body;
const image=req.file;
let media_url="";
let message_type=image?'image':'text';
if(message_type==='image')
{
  const buffer=fs.createReadStream(image.path);
  const response=await client.files.upload({
  file:buffer,
  fileName:image.orginalname
  })
  media_url=client.helper.buildSrc({
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT,
    src:response.filePath,
    transformation:[
      {quality:'auto'},
      {format:'webp'},
      {
        width:'1280'
      }
    ]
  })
}
const message=await Message.create({
  form_user_id:userId,
  to_user_id,
  text,
  message_type,
  media_url
})
res.json({
  success:true,
  message:"Succefully send message"
})

//send message to to_user_id

const messageWithUserData=await Message.findById(message._id).populate('from_user_id')

if(connections[to_user_id])
{
  connections[to_user_id].write(`data:${JSON.stringify(messageWithUserData)} \n\n`)
}
  }
  catch(err)
  {
console.log(err);
res.json({success:false,message:error.message})
  }
 }

 //get chat message


// export const getChatMessages=async(req,res)=>{
//   try{
//     const {userId}=req.auth();
//     const {to_user_id}=req.body;
//     const messages=await Message.find({
//       $or:[
//         {
//           form_user_id:userId,to_user_id
//         },
//         {
//           form_user_id:to_user_id,to_user_id:userId
//         }
//       ]
//     }).sort({createdAt:-1})
//   await Message.updateMany({form_user_id:to_user_id,to_user_id:userId},{
//     seen:true
    
//   })
//     res.json({
//       success:true,
//       message:"Successfully fetched messages",
//       messages
//     })

//   }
//   catch(err)
//   {

//   }
// }



export const getChatMessages=async(req,res)=>{
  try{
    const {userId}=req.auth()
    const {to_user_id}=req.body;
    const messages=await Message.find(
{
  $or:[
    {form_user_id:userId,to_user_id},
    {
      form_user_id:to_user_id,
      to_user_id:userId,
    }
  ]
}
    ).sort({createdAt:-1})

//mark messages as seen

await Message.updateMany({form_user_id:to_user_id,to_user_id:userId},{seen:true

})

res.json({success:true,messages})
  }
  catch(err)
  {
    res.json({
      success:false,
      message:error.message
    })
  }
}


export const getUserRecentMessages=async(req,res)=>{
  try{
    const {userId}=req.auth();
    const messages=await Message.find({
      to_user_id:userId
    }).populate('from_user_id to_user_id').sort({createdAt:-1})
    res.json({success:true,messages})
  }
  catch(err)
  {
 console.log(err);
 res.json({
  success:false,
  message:err.message
 })
  }
}


