import {Inngest} from "inngest";
import User from "../models/User.js";
import mongoose from "mongoose";
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



export const functions=[syncUserCreation,syncUserUpdation,syncUserDeletion]
