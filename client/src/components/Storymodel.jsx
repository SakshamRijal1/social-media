import { getToken, useAuth } from '@clerk/react';
import { ArrowBigLeft, ArrowLeft, Star, StarIcon, StarsIcon, Text, Upload } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import api from '../api/axois';
import { useNavigate } from 'react-router';
const Storymodel = ({setShowModal,fetchStories,setStories}) => {
 const [mode, setMode] = useState("text");
 const [text, setText] = useState("");
 const bgColors=["#4f46e5","#7c3aed","#db2777","#e11d48","#ca8a04","#0d9488"]
 const [background, setBackground] = useState(bgColors[0])
 const [media, setMedia] = useState(null)
 const [previewUrl, setPreviewUrl] = useState(null)
 const navigate=useNavigate()
 const handleUploadImage=(e)=>{
   const MAX_VIDEO_DURATION=60;
 const MAX_VIDEO_SIZE=50*1024*1024;
  const file=e.target.files?.[0];
  ///target you have a file tyo image ho ki vdo thaxaina,
  //maxvideo duration ra max video size lai pani mantain garu xa
if(file)
{


  if(file.type.startsWith('video'))
  {
  if(file.size>MAX_VIDEO_SIZE)
  {
    toast.error('File size exceed the limit.You can upload upto 50MB.');
    setPreviewUrl(null)
    setMedia(null)
    return
  }
  else{
    const video=document.createElement('video');
    video.preload='metadata';
    video.onloadedmetadata=()=>{
      window.URL.revokeObjectURL(video.src)
      if(video.duration>MAX_VIDEO_DURATION)
      {
         toast.error('File duration exceed the limit.You can upload video upto 60s.');
    setPreviewUrl(null)
    setMedia(null)
    return
      }
      else{
        setPreviewUrl(URL.createObjectURL(file))
        setMedia(file)

      }
    }
    video.src=URL.createObjectURL(file)
  }
  }
  else{
   setPreviewUrl(URL.createObjectURL(file))
   setMedia(file)
  }

}
else{
  toast.error('Select proper file.')
  return;
}










//  if(file)
//  {
//    if(file)
//  {
//   if(file.type.startsWith('video'))
//   {
//     if(file.size>MAX_VIDEO_SIZE*1024*1024)
//     {
//       toast.error(`Video file cannot exceed ${MAX_VIDEO_SIZE} MB.`)
//       setMedia(null)
//       setPreviewUrl(null)
//       return
//     }
//     const video=document.createElement("video");
//     video.preload='metadata';
//     video.onloadedmetadata=()=>{
//       window.URL.revokeObjectURL(video.src)
//       if(video.duration>MAX_VIDEO_DURATION)
//       {
//         toast.error("Video duration cannot exceed 1 minutes.")
//              setMedia(null)
//       setPreviewUrl(null)
//       return
//       }
//       else{
//         setMedia(file);
//         setPreviewUrl(URL.createObjectURL(file))
//         setText('')
//         setMode('media')
//       }
//     }
//     video.src=URL.createObjectURL(file);

//   }
//   else if(file.type.startsWith('image'))
//   {
//     setMedia(file);
//     setPreviewUrl(URL.createObjectURL(file))
//     setText('')
//     setMode('media')
//   }

//  }

//  }
 }
 const {getToken}=useAuth();

 const handleStoryAdd=async()=>{

  const token=await getToken();

 
  
//media_type,content,background_colo
  try
  {
 let media_type="text";
 if(media)
 {
  if(media.type.startsWith('image/'))
  {
  media_type="image"
  }
  else{
    media_type="video"
  }
 }
 if(!text && !media)
 {
  toast.error('Nothing to add story!');
  return
 }

    const storyData=new FormData();
    storyData.append('content',text);
    storyData.append('background_color',background);
    storyData.append('story',media)
    storyData.append('media_type',media_type)
   const {data}=await api.post('/api/story/add',storyData,{
    headers:{
      Authorization:`Bearer ${token}`
    }
   })
   if(data.success)
   {
    toast.success(data.message)
       setShowModal(false)
    setStories((prev)=>{
      return [data.story,...prev]
    });

  
    
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
    <div className='h-screen inset-0 p-2 z-110 fixed  bg-black/80 backdrop-blur flex justify-center items-center'>
   
   <div className=' w-full  max-w-md  '>
    <div className='text-white flex gap-10 text-center  justify-between'>
       <button  onClick={()=>{
        setShowModal(false)
       }} className='text-lg cursor-pointer'> <ArrowLeft/></button>
     <h1 className=''>Create Story</h1>
     <span className='w-10'></span>
     </div>
     <div style={{background:background}} className='mt-5 h-96 w-full flex justify-center items-center rounded-lg '>


     {
      mode=="text" &&
      <textarea onChange={(e)=>{
        setText(e.target.value)
      }} className='w-full max-h-full h-full p-3  resize-none font-extralight text-gray-200 outline-none border-none'
      placeholder="What's on your mind?"></textarea>
      
     }
     {
      mode==="media" &&  previewUrl &&( media?.type.startsWith('image/') ?(
        <img className='object-contain max-h-full' src={previewUrl} alt="" />
      ):
      (
        <video controls autoPlay className='object-contain max-h-full' src={previewUrl}/>)
      )
     }

     </div>

     <div className='flex gap-3 mt-5'>

      {
        bgColors.map((color)=>(
          <div onClick={()=>{
            setBackground(color)
          }} key={color} className={`w-8 cursor-pointer transition-all duration-100 h-8 rounded-full  ${background==color?"border-2":"border"} border-amber-50`} style={{background:color}}></div>
        ))
      }
     </div>
     <div className='mt-5 grid grid-cols-2 items-center content-center justify-center gap-4'>
      <button onClick={()=>{
        setMode("text");
        setMedia(null);
        setPreviewUrl(null)
      }} className={`${mode=="text"?"bg-gray-200 text text-slate-900":"bg-slate-900  text-gray-200"} py-2  justify-center transition-all duration-200 items-center cursor-pointer flex rounded-lg gap-4`}>
      <Text/>
      Text
      </button>

      <label onClick={()=>{
       
       setMode('media')
      }} className={` ${mode=="media"?"bg-gray-200 transition-all duration-200  text-slate-900":"bg-slate-900 text-gray-200"} py-2 rounded-lg justify-center cursor-pointer items-center flex gap-4`}>
        <input onInput={(e)=>{
          handleUploadImage(e)
        }} accept='image/*,video/*' className='hidden' type="file" name="" id="" />
        <Upload/>
       Add Photos/Videos
      </label>
     </div>
<div className='flex justify-center items-center mt-5 '>

  <button   onClick={(e)=>{
     toast.promise(handleStoryAdd(e),{
      loading:"Adding story.."
     })
        }} className='flex bg-indigo-600 w-full justify-center items-center text-white rounded-lg py-2 cursor-pointer gap-2'>
<StarsIcon/>
    Create Story
    </button>
</div>
   </div>
    </div>
  )
}

export default Storymodel
