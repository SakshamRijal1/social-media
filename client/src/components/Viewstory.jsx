import { CheckCheckIcon, CheckCircle, CheckCircle2, CircleCheck, CircleCheckIcon, Cross, CrossIcon, Dot, LucideCross, Pause, TimerOff, WeightIcon, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

const Viewstory = ({data,setShowStories}) => {
 const [progress, setprogress] = useState(0);
 const [pause,setPause]=useState(0);

const timerRef=useRef(null)
const progressRef=useRef(null)

 useEffect(()=>{

  if(data && data.media_type!=="video")
  {
   setprogress(0);

   const duration=10000;
   const stepTime=10;
   let elapsed=0;

progressRef.current= setInterval(() => {
    elapsed+=stepTime;
    setprogress((elapsed/duration)*100);
   }, stepTime);
   timerRef.current=setTimeout(() => {
    setShowStories(null)
   
   }, duration);

  }
  return ()=>{
    clearTimeout(timerRef.current)
    clearInterval(progressRef.current)
  }

 },[data,setShowStories])
const handleClose=()=>{
  setShowStories(null);
}
const handlePause=()=>{

   clearTimeout(timerRef.current)
    clearInterval(progressRef.current)
}

if(!data) return;
  return (

    <div style={{'background':`${data.background_color}`}} className={`h-screen min-h-screen  z-120 ${data.media_type!=="text"?"bg-black":""}  inset-0 fixed `}>



      {
        data.media_type!=="video" &&
      <div className='bg-gray-500  fixed top-0 left-0 w-full'>
        <div style={{"width":`${progress}%`}} className='py-0.5 bg-white'>
           
        </div>

      </div>
}
      <div  className={`absolute top-4 left-4 flex gap-4  p-4 rounded-lg bg-neutral-700`}>
        <img className='rounded-full object-cover w-10 h-10  ' src={data.user.profile_picture} alt="" />
        <div>
          <div className='flex gap-3 items-center-safe '>

         
           <h1 className='font-semibold text-white'>{data.user.full_name}</h1>
      <CircleCheckIcon className='fill-indigo-600 size-5 text-white'/>
             </div>
      <p className='text-gray-400 text-sm font-light flex gap-0.5'>@{data.user.username} <Dot/> {dayjs(data.createdAt).fromNow()} </p>
        </div>


      
      
</div>
<div className=' right-4 top-4 gap-4 p-2 absolute'>
<button  className=' cursor-pointer  shadow-xs shadow-white bg-red-600 p-2 rounded-lg' onClick={()=>{
handleClose()
      }} ><X className='text-white' /></button>

     </div>

      <div className='w-full h-full text-center text-2xl flex  max-md:object-contain items-center justify-center sm:p-10'>
      {
        data.media_type=="text" && <p className='w-9/12 m-auto text-white font-extralight text-wrap'>{data.content}</p>
      }
      {
        data.media_type=="image" && <img className='object-cover h-full max-md:object-contain ' src={data.media_url} alt="" />
      }
      {
        data.media_type=="video" && <video onEnded={()=>{
          setShowStories(null)
        }} 
          controls autoPlay className='object-cover h-screen max-md:object-contain ' src={data.media_url}></video>
      }

      </div>
    </div>
  )
}

export default Viewstory
 