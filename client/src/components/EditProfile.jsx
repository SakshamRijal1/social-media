import { Edit2 } from 'lucide-react'
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { updateUser } from '../features/user/userSlice.js';
import { useAuth } from '@clerk/react';
const EditProfile = ({details,setEdit}) => {
 const [profile, setProfile] = useState(null);
 const [coverPhoto, setCoverPhoto] = useState(null);
 const [profileFile, setProfileFile] = useState(null)
 const [coverFile, setCoverFile] = useState(null)
 const name=useRef("")
 const username=useRef("")
 const bio=useRef("")
 const location=useRef("")
const {getToken}=useAuth()
const dispatch=useDispatch()
const handleSaveChange=async(e)=>{
if(name.current.value.length>25)
{
 toast.error("Name is too long.");
 return
}
if(username.current.value.length>20)
{
 toast.error("User name is too long.")
 return
}
const token=await getToken()



  const profile_picture=profileFile 
  const cover_photo=coverFile
   const full_name=name.current.value
 const user_name=username.current.value
  const about=bio.current.value
 const user_location=location.current.value
const userData=new FormData();
userData.append('username',user_name)
userData.append('bio',about)
userData.append('location',user_location)
userData.append('full_name',full_name)
profile_picture && userData.append('profile',profile_picture)
 cover_photo && userData.append('cover',cover_photo)
try{
   dispatch(updateUser({userData,token}))
setEdit(false)

}
catch(err)
{
  toast.error(err.message)
}
}
  return (
    <div className='fixed bg-black/80 backdrop-blur w-screen h-screen  inset-0 z-110 flex justify-center p-5 max-sm:z-50 max-sm:p-0'>
    <div className='bg-white flex flex-col gap-3  max-sm:w-full sm:rounded-lg  w-150 max-sm:h-full  no-scrollbar min-h-full overflow-y-auto relative '>
<h1 className='text-2xl  border-b bg-white w-full border-b-gray-300 font-bold p-3 z-50 text-gray-800 sticky top-0'>Edit Profile</h1>
<div className='flex gap-1 flex-wrap flex-col p-2 '>
  <div className=''>


<h1 className='text-sm text-gray-800'>Profile Picture</h1>
<img className='w-25 h-25 rounded-full object-cover' src={ profile || details.profile_picture} alt="" />
  </div>
  <div>

 
  <label onChange={(e)=>{
const link=e.target.files?.[0];
if(!link) return;
setProfile(URL.createObjectURL(link));
setProfileFile(link)



   }} className='flex gap-2 my-3 px-2 py-1 rounded-lg   cursor-pointer hover:bg-gray-300 transition-all duration-300  border border-gray-200 justify-center items-center text-gray-700  relative z-10 '>

  <Edit2 className='w-5 h-5  '/> Change Profile Picture
      <input className=' hidden' type="file" accept='image/*' id="" />
  </label>
  {

  profile &&
  <button onClick={()=>{
setProfile(null)
setProfileFile(null)
  }}  className='w-full px-2 py-1 rounded-lg bg-red-600 text-white hover:bg-red-800 transition-all duration-200 cursor-pointer'>Clear</button>
}

 </div>
</div>
<div className='flex gap-1 flex-col p-2'>
  <div>


<h1 className='text-sm text-gray-800'>Cover Photo</h1>
{
  coverPhoto||details.cover_photo ?

<img className=' rounded-lg max-sm:w-full h-50 w-9/12 object-cover' src={coverPhoto || details.cover_photo} alt="" /> :<div className='rounded-lg max-sm:w-full h-50 w-9/12 object-cover bg-gradient-to-r from-purple-600  to-pink-600 '></div>
}

  </div>
  <div>


   <label onChange={(e)=>{
const link=e.target.files?.[0];
if(!link) return;
setCoverPhoto(URL.createObjectURL(link));
setCoverFile(link)


   }} className='flex gap-2 my-3 px-2 py-1 rounded-lg  cursor-pointer hover:bg-gray-300 transition-all duration-300  border border-gray-200 justify-center items-center text-gray-700  relative z-10 '>

  <Edit2 className='w-5 h-5 '/> Change Cover Photo
      <input className=' hidden' type="file" accept='image/*' id="" />
  </label>
      {

  coverPhoto &&
  <button onClick={()=>{
    setCoverPhoto(null);
    setCoverFile(null)
  
    
  }} className='w-full px-2 py-1 rounded-lg bg-red-600 text-white hover:bg-red-800 transition-all duration-200 cursor-pointer'>Clear</button>
}
    </div>
</div>
<div className='flex gap-1 flex-col p-2'>
<h1 className='text-sm text-gray-800'>Name</h1>
<input ref={name}  className='w-full h-full border-none outline outline-gray-300 rounded-lg px-4 py-2.5' type="text" name="" defaultValue={details.full_name} id="" />
</div>
<div className='flex gap-1 flex-col p-2'>
<h1 className='text-sm text-gray-800'>Username</h1>
<input ref={username} className='w-full h-full border-none outline outline-gray-300 rounded-lg px-4 py-2.5' type="text" name="" defaultValue={details.username} id="" />
</div>
<div className='flex gap-1 flex-col p-2'>
<h1 className='text-sm text-gray-800'>Bio</h1>
<textarea ref={bio}  rows={3}  className='w-full resize-none  text-nowrap  h-full   border-none outline outline-gray-300 rounded-lg px-4 py-2.5' type="text" name="" defaultValue={details.bio} id="" />
</div>
<div className='flex gap-1 flex-col p-2'>
<h1 className='text-sm text-gray-800'>Location</h1>
<input ref={location} className='w-full h-full  border-none outline outline-gray-300 rounded-lg px-4 py-2.5' type="text" name="" defaultValue={details.location} id="" />
</div>
<div className='w-full flex max-sm:justify-center justify-end p-2 border-t border-gray-300 sticky bottom-0 bg-white '>
  <div className='flex gap-5 p-2 max-sm:w-full max-sm:flex-col '>

 
<button onClick={()=>{
  setEdit(false)
}} className=' rounded-md py-1 px-7  cursor-pointer  hover:bg-gray-200 border-gray-300 border transition-all duration-300'>Cancel</button>
  <button  onClick={()=>{
    handleSaveChange()
  }}

    class={`group relative px-5 max-md:w-full py-1 text-white rounded-md flex justify-center items-center backdrop-blur-xl border-2   bg-linear-to-r from-purple-500 to-pink-500 shadow-2xl hover:bg-linear-to-r hover:from-pink-500 hover:to-purple-500 hover:scale-[1.02] hover:-translate-y-1 active:scale-95  cursor-pointer   transition-all duration-500 ease-out    overflow-hidden`}>
    <div class="absolute  inset-0 bg-gradient-to-r from-transparent via-white  to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
    ></div>

  

Save Changes
  </button>
   </div>
</div>
    </div>
    </div>
  )
}

export default EditProfile
