import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { dummyMessagesData, dummyRecentMessagesData, dummyUserData } from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowUp, BadgeCheck, Check, CheckCheck, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast'
const ChatBox = () => {
  const {id}=useParams();
  const [user, setUser] = useState(null);
const chatBox = useRef(null)
  const [load, setLoad] = useState(true);

  const handleSend=async()=>{

  }



  useEffect(()=>{

setUser(dummyUserData);
setLoad(false);


  },[])
  if(load)
  {
    return <Loading/>
  }
  if(id!==dummyMessagesData[0].from_user_id && id!==dummyMessagesData[0].to_user_id)
  {
return <p className='text-center  h-screen flex justify-center items-center text-gray-600'>Error!!</p>
  }
  return (
    <div   className='min-h-screen bg-gradient-to-r from-white to-purple-100 scroll-  scroll-smooth w-full flex flex-col' >

    <div className='flex   backdrop-blur-sm   gap-2 items-center bg-transparent  w-full sticky top-0  border-b border-b-gray-300 z-50 '>
    
     {/* <img onClick={()=>{
          navigate('/')
        }} className='w-26 ml-7 my-2 cursor-pointer' src={assets.logo} alt="" />
        <hr className='border-gray-300 mb-8'/> */}
  
          <img className='w-9.5 ml-5  my-2 rounded-full object-cover  h-9.5  ' src={user.profile_picture} alt="profile-photo" />
    
    <h1 className='font-semibold flex gap-1'>{user.full_name}{user.is_verified && <BadgeCheck className='fill-blue-600 text-white'/>}</h1>


      



    </div>
<div dir=''  className='px-10 h-full  bg-gradient-to-r from-white to-purple-100 py-17   w-full  flex flex-col scroll-smooth gap-2'>
  {dummyMessagesData.map((item,index)=>(
    <div className='flex flex-col' key={index}>
      {
      item.message_type=="image" &&  <div className={`${item.to_user_id==id && "items-end bg-green-100  justify-end  self-end"} w-fit shadow   flex flex-col  rounded-lg object-cover relative  p-2`}>

          <img className=' w-80 rounded-lg h-80  object-cover ' src={item.media_url} alt="" />

          <div className='self-end flex gap-2
           '>
      <p className=' self-end text-nowrap mt-2 text-gray-500'>{new Date(item.createdAt).toLocaleTimeString()}</p> 
        {
  item.to_user_id==id &&  !item.seen && <Check/>
  
  }
  {
  item.to_user_id==id &&  item.seen && <CheckCheck className='text-indigo-600'/>
  }
          </div>
  
         
        </div>
      }
      
      {
        item.message_type=="text" && <div className={`max-w-80   ${item.to_user_id==id ? " bg-green-100 items-end justify-end  self-end":"self-start"} p-2 items-center  gap-2 flex  rounded-lg shadow`}>
<p>{item.text}</p>
  <p className={`self-end text-nowrap mt-2 text-gray-500`}>{new Date(item.createdAt).toLocaleTimeString()}</p>  
  {
  item.to_user_id==id &&  !item.seen && <Check/>
  
  }
  {
  item.to_user_id==id &&  item.seen && <CheckCheck className='text-indigo-600'/>
  }
        </div>
      }
    </div>
  ))}
  <div className='w-full flex justify-center items-center  '>
  <form onSubmit={(e)=>{
    e.preventDefault()
  toast.promise(handleSend(),{
    
    loading:"Sending",
    success:"Sent",
    error:"Couldnot send the message!Please try again"
  })
}} className='w-96  fixed bottom-7 rounded-lg  shadow flex items-center '>  
<input className='w-full text-gray-900 py-3  rounded-lg border-none pr-3  pl-10 outline-none' placeholder='Enter message' type="text" />
<ImagePlus className='absolute text-gray-700 hover:shadow  rounded-sm cursor-pointer active:scale-95 transition-all duration-300 top-[25%] mx-2'/>
<button  className='px-3 rounded-r-lg cursor-pointer active:scale-95 transition-all duration-300 py-3 shadow bg-indigo-600 text-white h-full'><ArrowUp/></button>
 </form>
</div>
</div>

    </div>
  )
}

export default ChatBox
