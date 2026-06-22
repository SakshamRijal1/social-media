import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets'
import Loading from './Loading'
import { BadgeCheck, Dot, Heart, IndianRupee, MessageCircle, Share, TurkishLira } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from 'react-router'
import Seepost from './Seepost'
import { useSelector } from 'react-redux'
import api from '../api/axois'
import { useAuth } from '@clerk/react'
import toast from 'react-hot-toast'
import CommentModel from './CommentModel'
dayjs.extend(relativeTime);
const Post = ({item}) => {

  const user=useSelector((state)=>state.user.value)
const [comment, setComment] = useState(false);
const [userComments, setUserComments] = useState([]);
const postShare=async(req,res)=>{
  const postUrl=`${window.location.origin}/seepost/${item._id}`
  if(navigator.share)
  {
  try{

    await navigator.share({
      title:item.content||"Check out this post",
      url:postUrl
    })
  }

  catch(err)
  {
    console.log(err)
  }
}
else{
  await navigator.clipboard.writeText(postUrl);
  toast.success('Url copied')
}
}
const {getToken}=useAuth()
  const [like,setLike]=useState(item.likes_count);

  const handleLike=async()=>{

    const token=await getToken()
    const {data}=await api.post('/api/post/like',
      {
        postId:item._id,
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    
    )
    if(data.success)
    {
      toast.success(data.message);
    setLike(prev=>{
      if(prev.some((likedUser)=>likedUser._id==user._id))
      {
        return prev.filter(likedUser=>likedUser._id!==user._id)
      }
      else{
        return [...prev,user]
      }
    })

    }
    else{
      toast.success(data.message)
  
    }
  }


  useEffect(()=>{
    setComment(false)
    const fetchComment=async()=>{
      const token=await getToken();
      try{
      const {data}=await api.post('/api/comment/get',{
        postId:item._id,
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(data.success)
      {
  
        setUserComments(data.comment)
      }
    }


  catch(err)
  {
toast.error(err.message)
  }  }
  fetchComment();
  },[item])
  const currentUser=useSelector((state)=>state.user.value)
  const navigate=useNavigate()

 const postWithHastags=item.content.replace(/(#\w+)/g,'<span class="text-indigo-600 hover:underline">$1</span>')
return (
<>
 
 <div className=" bg-white rounded-lg  p-5 lg:p-10 flex justify-center  flex-col relative">

      <div className='flex gap-4 '>
    
      <img className='w-13  rounded-full object-cover relative bottom-5 h-13' src={item.user.profile_picture} alt="cover-photo" />
      <div className='flex  relative flex-col bottom-5'>
    <h1 className='font-semibold flex gap-1 flex  items-center'>{item.user.full_name}{item.user.is_verified && <BadgeCheck className='fill-blue-600 text-white size-4'/>}</h1>
      <p className='text-gray-700 text-sm font-light flex gap-0.5'>@{item.user.username} <Dot/> {dayjs(item.createdAt).fromNow()} </p>
      </div>
          
      </div>
  

   
{  item.content &&    <p className='w-full text-wrap  mb-3 font-light'dangerouslySetInnerHTML={{__html : postWithHastags}} /> 
}
<div  className='grid grid-cols-2 gap-2 cursor-pointer active:scale-98 transition-all duration-200 '>
   {   item.image_urls && item.image_urls.map((image,index)=>(
 <img  onClick={()=>{
  navigate(`/seepost/${item._id}`)
 }}
      key={index}  src={image}
        alt="photo"
        className={`w-full   rounded-lg min-h-[250px] md:min-h-[350px] lg:min-h-[450px] object-cover ${item.image_urls.length==1 && 'col-span-2 h-auto'}`}
      />
    ))
   }  
   </div>

 
   

<div className='flex mt-5 gap-10 border-t border-t-gray-400 p-4'>
<div className=''> 
    <Heart onClick={()=>{
     
     handleLike()
    }} className={`cursor-pointer ${like.some(liked=>liked._id==user._id)? 'fill-red-600 duration-150 text-red-600 transition-all':''} `}/>

   <p className='font-semibold duration-150 transition-colors '> {like.length}  likes</p>
   <div className='flex'>
    
    {
  like.map((likedUser,index)=>(
        <>

        {

          index <3 &&

        <img className='w-4 h-4 object-cover rounded-full' src={likedUser.profile_picture} alt="" />
}
        </>
        
      ))
    }
   </div>
       </div>
       <div>
 <MessageCircle onClick={()=>{
  if(comment)
  {

  
  setComment(false)
  }
  else{
 setComment(true)
  }
 }} className='cursor-pointer'/>
  <p className='font-semibold duration-150 transition-colors '> {userComments.length}</p>
 </div>
 <Share onClick={()=>{
postShare()
 }} className='cursor-pointer'/>
        </div>

          {
          comment && <CommentModel  setComment={setComment} setUserComments={setUserComments} comments={userComments} post={item}/>
        }

        </div>
         
      </>
    


   

) }

export default Post;
