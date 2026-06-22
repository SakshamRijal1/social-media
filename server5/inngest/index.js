import {cron, Inngest, step} from "inngest";
import User from "../models/User.js";
import mongoose from "mongoose";
import Connection from "../models/Connection.js";
import sendEmail from "../config/nodemailer.js";
import Story from "../models/Story.js";
import Message from "../models/Message.js";
export const inngest=new Inngest({
  id:"Sakshamedia"
})


const syncUserCreation=inngest.createFunction(
  {
    id:"sync-user-creation",
    triggers:[
      {
      event:"clerk/user.created"//source/object.action
      }
    ]
  },
  async({event})=>{

    console.log("Function triggered");
    console.log("Mongo state:", mongoose.connection.readyState);

    const {id,email_addresses,first_name,last_name,image_url}=event.data;
    let username=email_addresses[0].email_address.split('@')[0];

  let existingUsername=await User.findOne({
    username
  });
  while(existingUsername)
  {
    username=username+Math.floor(Math.random()*1000);
existingUsername=await User.findOne({
    username
  });
  }
    const userCreated={
      _id:id,
      email:email_addresses[0].email_address,
      full_name:first_name +" " + last_name,
      profile_picture:image_url,
           username

    }
const existingUser=await User.findById(id);
if(!existingUser)
{
  await User.create(userCreated)
}
  })

const syncUserUpdation=inngest.createFunction(
  {
    id:"sync-user-updation",
    triggers:[
      {
      event:"clerk/user.updated"//source/object.action
      }
    ]
  },
  async({event})=>{
    const {id,email_addresses,first_name,last_name,image_url}=event.data;

    const userUpdated={
      email:email_addresses[0].email_address,
      full_name:first_name +" " + last_name,
      profile_picture:image_url,
  

    }
await User.findByIdAndUpdate(id,userUpdated);
  })

const syncUserDeletion=inngest.createFunction(
  {
    id:"sync-user-deletion",
    triggers:[
      {
      event:"clerk/user.deleted"//source/object.action
      }
    ]
  },
  async({event})=>{
    const {id}=event.data;

await User.findByIdAndDelete(id)
  })
//Inggest fn to send reminder when a new cnnenction request is added
 //the event is app/connection-request
const sendNewConnectionRequestReminder=inngest.createFunction({
  id:"send-new-connection-request-reminder",
  triggers:[{
  event:"app/connection-request"
}]
},

async({event,step})=>{
const {connectionId}=event.data;
await step.run('sent-connection-request-mail',async()=>{
  const connection=await Connection.findById(connectionId).populate('from_user_id to_user_id'
  );
  const subject="👋 New Connection Request";
const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Connection Request</title>
</head>

<body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">

  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:10px; overflow:hidden;">

    <!-- Header -->
    <div style="background:#4f46e5; padding:20px; text-align:center; color:white;">
      <h2 style="margin:0;">👋 New Connection Request</h2>
    </div>

    <!-- Body -->
    <div style="padding:20px; color:#333;">

      <p>Hi <b>${connection.to_user_id.full_name}</b>,</p>

      <p>
        You have received a new connection request on <b>SakshaMedia</b>.
      </p>

      <!-- User Info Card -->
      <div style="margin:20px 0; padding:15px; background:#f9f9f9; border-radius:8px;">
        <p style="margin:5px 0;">
          👤 <b>Name:</b> ${connection.from_user_id.full_name}
        </p>
        <p style="margin:5px 0;">
          📩 <b>Username:</b> @${connection.from_user_id.username}
        </p>
      </div>

      <p>
        You can accept or ignore this request anytime from your dashboard.
      </p>

      <!-- Button -->
      <div style="text-align:center; margin-top:20px;">
        <a href="${process.env.FRONTEND_URL}/connections"
           style="background:#4f46e5; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block;">
          View Connection Request
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#666;">
      SakshaMedia © All rights reserved
    </div>

  </div>

</body>
</html>
`;
await sendEmail({
  to:connection.to_user_id.email,
  subject,
  body

}) 
})


const in24Hours=new Date(Date.now()+24*60*60*1000)
await  step.sleepUntil('wait-for-24hours',in24Hours);
await step.run('send-connection-request-reminder',async()=>{
  const connection=await Connection.findById(connectionId).populate('from_user_id to_user_id');
  if(connection.status==="accepted")
  {
    return {
     message: "Already accepted the request"
    }
  }
   const subject="🕐 Connection Request Reminder"
  const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Connection Request Reminder</title>
</head>

<body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">

  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:10px; overflow:hidden;">

    <!-- Header -->
    <div style="background:#f59e0b; padding:20px; text-align:center; color:white;">
      <h2 style="margin:0;">⏰ Reminder: Connection Request</h2>
    </div>

    <!-- Body -->
    <div style="padding:20px; color:#333;">

      <p>Hi <b>${connection.to_user_id.full_name}</b>,</p>

      <p>
        You still have a pending connection request waiting for your response on <b>SakshaMedia</b>.
      </p>

      <!-- User Card -->
      <div style="margin:20px 0; padding:15px; background:#f9f9f9; border-radius:8px;">
        <p style="margin:5px 0;">
          👤 <b>Name:</b> ${connection.from_user_id.full_name}
        </p>
        <p style="margin:5px 0;">
          📩 <b>Username:</b> @${connection.from_user_id.username}
        </p>
      </div>

      <p>
        Don’t miss out on growing your network 🚀
      </p>

      <!-- Button -->
      <div style="text-align:center; margin-top:20px;">
        <a href="${process.env.FRONTEND_URL}/connections"
           style="background:#f59e0b; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block;">
          Review Request
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#666;">
      SakshaMedia © All rights reserved
    </div>

  </div>

</body>
</html>
`;
await sendEmail({
  to:connection.to_user_id.email,
  subject,
  body
})

return {
  message:"Reminder sent."
}



})
}
)


//make a inngest function to send the email 

// const sendNewConnectionReminder=inngest.createFunction({
//   id:'send-new-connection-request',
//   triggers:[
//     {
//       event:"app/connection-request"
//     }
//   ]
// },async({event,step})=>{
//   const {connectionId}=event.data;
  
//    await step.run('send-connection-request-mail',async()=>{
//     const connection=await Connection.findById(connectionId).populate('from_user_id to_user_id');
//     if(!connection) return
//     const subject="New Connection Request"
//     const body=""
//     await sendEmail({
//       subject,body,
//       to:connection.to_user_id.email
//     })
//    })
//   let in24Hours=new Date(Date.now()+24*60*60*1000);
//  await step.sleepUntil('last-24-hours',in24Hours);

//   await step.run('send-connection-request-reminder',async()=>{
    
//     const connection=await Connection.findById(connectionId).populate('from_user_id to_user_id');
//      if(!connection) return

//     const subject="🕐 Pending Connection Request"
//     const body=""
//       if(connection.status=="accepted")
//   {
//     return {
//       message:"Already accepted"
//     }
//   }
//   await sendEmail({
//     to:connection.to_user_id.email,
//     body,
//     subject
//   })

   

//   })
// })
 
//innngest function to delete story after 24 hours
const deleteStory=inngest.createFunction({
  id:"story-delete",
  triggers:[
    {
      event:'app/story.delete'
    }
  ]
},async({event,step})=>{
  const {storyId}=event.data;
  const in24Hours=new Date(Date.now()+24*60*60*1000);
  await step.sleepUntil('wait-for-24hours',in24Hours)
  await step.run('user-story-delete',async()=>{
    const story=await Story.findById(storyId);
    if(!story) {
      return {message:"Already deleted"}
    }

    await Story.deleteOne({
      _id:storyId
    })
return {
  message:"Story deleted successfully"
}
  })
})






const sendNotificationOnUnseenMessages=inngest.createFunction({
  id:'send-unseen-message',
  triggers:[
    {cron:'TZ=America/New_York 0 9 * * *'}
  ]
},async({step})=>{
  const unseenMessages={};
  const messages=await Message.find({seen:false}).populate('to_user_id from_user_id')
  messages.forEach((message)=>
  {
    


  unseenMessages[message.to_user_id._id]=(unseenMessages[message.to_user_id._id]||0)+1;

})
await step.run('send-email-message-unread',async()=>{
  for(const id in unseenMessages)
  {
    const user=await User.findById(id)
    const subject=`📥 Hey ${user.full_name},You have ${unseenMessages[id]} unread message on SakshaMedia.`
const body = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px;">

      <h2 style="color: #333;">📥 Unread Messages Notification</h2>

      <p>Hi <b>${user.full_name}</b>,</p>

      <p>
        You have <b>${count}</b> unread messages waiting for you on <b>SakshaMedia</b>.
      </p>

      <div style="text-align: center; margin: 20px 0;">
        <a href=${process.env.FRONTEND_URL}
           style="background-color: #4CAF50; color: white; padding: 12px 20px;
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Open App
        </a>
      </div>

 
    </div>
 <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#666;">
      SakshaMedia © All rights reserved
    </div>

  </body>
</html>
`;
    await sendEmail({
      to:user.email,
      subject,
      body

    })
  }
  
})
return {
  message:"Send email successfully"
}


})


export const functions=[syncUserCreation,syncUserUpdation,syncUserDeletion,sendNewConnectionRequestReminder,deleteStory,sendNotificationOnUnseenMessages]
