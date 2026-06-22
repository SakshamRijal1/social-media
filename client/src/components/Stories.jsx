import React, { useEffect, useRef, useState } from 'react'
import { dummyStoriesData } from '../assets/assets'
import Loading from './Loading'
import { ArrowLeft, ArrowRight, CirclePlusIcon, Plus } from 'lucide-react'
import dayjs from 'dayjs'
import Storymodel from './Storymodel'
import Viewstory from './Viewstory'
import { useAuth } from '@clerk/react'
import api from '../api/axois'
import toast from 'react-hot-toast'

const Stories = () => {
const [stories, setStories] = useState([])
const [showModel, setShowModel] = useState(false)
const [showStories, setShowStories] = useState(null)
const [load, setLoad] = useState(true);
const story=useRef(null)
const [scrollX, setScrollX] = useState(0)
const {getToken}= useAuth();
const handleView=async(item)=>{
  console.log('viewd')
const token=await getToken()

const {data}=await api.post('/api/story/see',{
  storyId:item._id
}, 
{
  headers:{
    Authorization:`Bearer ${token}`
  }
}





)

}

const addStory=async ()=>{
const token=await getToken()


const {data}=await api.get('/api/story/feed',{
  headers:{
    Authorization:`Bearer ${token}`
  }
})
 if(data.success)
 {
  setStories(data.stories)
 }
 else{
  toast.error(data.message)
 }
  
  setLoad(false);

}
useEffect(() => {
  addStory()

}, [])



  return !load ? (
     <div  className='px-4 relative group'>
  { 
  (story.current &&( (story.current.scrollWidth-story.current.offsetWidth))>Math.ceil(scrollX)) &&
  <div  onClick={()=>{
    story.current.scrollBy({
      left:300,
    })
  }} className='absolute active:scale-95 transition-all duration-200 animate-pulse text-white max-md:hidden top-[40%] right-5 p-3 rounded-full bg-gray-600 z-110  hidden group-hover:flex cursor-pointer'>
      
         <ArrowRight 
       className=' '/>
        </div>}
   { 
  (story.current && scrollX>0) &&
  <div onClick={()=>{
    story.current.scrollBy({
      left:-300,
    })
  }} className='absolute transition-all duration-200 animate-pulse active:scale-95 text-white max-md:hidden top-[40%] left-5 p-3 rounded-full bg-gray-600 z-110  hidden group-hover:flex cursor-pointer'>
      
         <ArrowLeft className=' '/>
        </div>}
      <div ref={story} onScroll={()=>{
   setScrollX(story.current.scrollLeft)
     }} className='flex scroll-smooth  bg-white rounded-lg shadow my-4  overflow-x-auto no-scrollbar  '>

    
           <div onClick={()=>{
            setShowModel(true)
           }}  className='min-w-35 max-w-35 rounded-lg hover:shadow  shadow-gray-400 transition-all duration-150 hover:scale-101 cursor-pointer border-2 border-violet-300  border-dashed h-45  m-5 flex flex-col justify-center items-center'>
           <CirclePlusIcon className='fill-indigo-600  text-white w-10 h-10'/>
           <p>Create Story</p>
          </div>
{
        stories.map((item,index)=>(
          
          <div onClick={()=>{
            setShowStories(item)
            handleView(item)
          }} key={index} className='min-w-35 max-w-35 rounded-lg hover:shadow  shadow-gray-400 transition-all duration-150 hover:scale-101 cursor-pointer justify-center items-center  h-45  m-5 relative flex'>
<img className='rounded-full h-10 absolute top-3 left-3  z-20 w-10 object-cover' src={item.user.profile_picture}alt="" />
<div>
<p className='absolute z-20 bottom-3 right-2 font-extralight text-white '>{ dayjs(item.createdAt).fromNow()
}</p>

</div>

{
  item.media_type=="image" &&
  <img className='object-cover rounded-lg w-full h-full' src={item.media_url}/>}
 
 {item.media_type=="text" && <div style={{'background':`${item.background_color}`}}  className={`truncate w-full h-full  rounded-lg  items-center flex`}> 

    <p  className='text-white font-extralight'>{item.content}</p>
  </div>}
{
  item.media_type=="video" &&
  <video className='object-cover rounded-lg w-full h-full' src={item.media_url}/>}

          </div>
        ))
      }
      {

      }

{
  showModel && <Storymodel setShowModal={setShowModel} setStories={setStories}   fetchStories={addStory}></Storymodel>
  
}
{
  showStories && <Viewstory setShowStories={setShowStories} data={showStories}/>
}
    </div>
    </div>
  ):<Loading/>
}

export default Stories
