import React, { useEffect, useRef, useState } from 'react'
import { BadgeCheck, Captions, Image, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import api from '../api/axois'
import { getToken, useAuth } from '@clerk/react'
import { useNavigate } from 'react-router'
const CreatePost = () => {

const [load, setLoad] = useState(false);
const [captionWithHastag, setCaptionWithHastag] = useState("");
const caption=useRef('')
const [url, setUrl] = useState([])
const {getToken}=useAuth()
const [image, setImage] = useState([])
const user=useSelector((state)=>state.user.value)
const navigate=useNavigate()
const handlePost=async()=>{
  const token=await getToken()
  let content=""
  let post_type=""
 try{


  if(caption.current.value)
  {
    content=caption.current.value;
  }
  if(url.length==0 && !content)
  {
   return toast.error("Cannot add empty post.")
  }
  if(content && url.length>0)
  {
    post_type="text_with_image"
  }
  else if(content && url.length==0)
    
  {
  
    post_type="text"
  }
  else{
    post_type="image"
  }


  const post=new FormData()
 post.append('content',content)
 post.append('post_type',post_type)

 for(const val of image)
 {
  post.append('images',val)
 }

 const {data}=await api.post('/api/post/add',post,
  {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }
 )
 if(data.success)
 {
  toast.success(data.message);
  navigate('/')
  
 }
 else{
  toast.error(data.message)
 }
  

}
catch(err)
{
  toast.error(err.message)
}
}

  return (



      <div className='md:p-10 p-3 w-full overflow-x-hidden'>
  <h1 className='text-2xl font-bold'>Create Post</h1>
  <p className=' text-gray-500 mt-4'>Share your thoughts to the world.</p>
  
  <div className='w-full max-md:w-full p-3 rounded-lg shadow flex flex-col  gap-3 '>

{
  
      <div className='flex flex-col  rounded-lg   gap-4'>
    <img  className='w-15 h-15 object-cover rounded-full' src={user.profile_picture} alt="profile-picture" />
    <div>

   
    <h1 className='font-semibold flex gap-1'>{user.full_name}{user.is_verified && <BadgeCheck className='fill-blue-600 text-white'/>}</h1>
    <p className='text-gray-500'>@{user.username}</p>


  </div>
  </div>
}
<div className='  mb-10 '>

<textarea ref={caption} onInput={(e)=>{
setCaptionWithHastag(e.target.value.replace(/(#\w+)/g,`<span class="text-indigo-600">$1</span>`))
}}  placeholder='What happening?' className='resize-none w-full mt-3 p-2  outline-gray-300 rounded-lg ' />
{
  ( url.length>=1 || captionWithHastag!=="") &&

<div className='w-full rounded-lg shadow p-3 '>


<p className='w-full  p-2 text-gray-700 rounded-lg top-0'  dangerouslySetInnerHTML={{
  __html:captionWithHastag
}}/>
<div className='w-full min-h-full flex gap-2 flex-wrap justify-center items-center'>
  {
    url.length>=1 && <div className='relative border border-gray-300 rounded-lg p-3   items-center grid grid-cols-2 gap-2 content-center justify-center'>

{
url.length==1 && 
<div className='col-span-2 relative w-96 h-96  '>

    <img className='w-full h-full object-cover ' src={url} alt="" />
    <X onClick={()=>{
  setUrl([])
  setImage([])
}} className='absolute top-0 right-0 cursor-pointer     shadow w-8 h-8 flex items-center bg-white text-gray-700 active:scale-95 transition-all duration-200'/>
</div>
    
}
{
  url.length>1 &&(
    
    url.map((item,index)=>(

      <div className='max-w-96 min-w-96 relative'>
            <X onClick={()=>{

setUrl(url.filter(link=>link!==item))


setImage(image.filter((_,i)=>i!==index))

}} 
 className='absolute top-0 right-0 cursor-pointer    shadow w-8 h-8 flex items-center bg-white text-gray-700 active:scale-95 transition-all duration-200'/>
 <img className='w-full  max-w-96 max-h-96   object-cover' src={item} alt="" />
 </div>
    ))

     
  )
}

    </div>
  }
</div>
</div>}
<div>


</div>
</div>
<hr  className='text-gray-300 w-full'/>
<div className='flex justify-between items-center w-full  max-md:flex-col gap-5'>

     <label  className={`gap-4`}>
        <input onChange={(e)=>{
                  const link=e.target.files?.[0];
  if(!link) return;
               setUrl((items=>[...items,URL.createObjectURL(link)]))
               setImage(images=>[...images,link])
                
        }}  accept='image/*,videos/*' className='hidden ' type="file" name="" id="" />
<Image  className='cursor-pointer hover:scale-95 transition-all duration-200 shadow'/>
      </label>
   <div  class="flex flex-col gap-6 max-md:w-full  relative z-10">
  <button onClick={()=>{
    handlePost()
  }}
    class="group relative px-5  py-3 text-white rounded-md flex justify-center items-center backdrop-blur-xl border-2   bg-linear-to-r from-purple-500 to-pink-500 shadow-2xl   hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out cursor-pointer  hover:bg-linear-to-r hover:from-pink-500 hover:to-purple-500 overflow-hidden">
    <div class="absolute  inset-0 bg-gradient-to-r from-transparent via-white  to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
    ></div>

  
Publish Post

  </button>
</div>
  </div>


  </div>
  </div>)
 
  }

export default CreatePost
