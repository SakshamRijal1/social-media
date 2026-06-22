import { BadgeCheck, Heart } from 'lucide-react';
import React, { useState } from 'react'
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { getToken, useAuth } from '@clerk/react';
import { useSelector } from 'react-redux';
import api from '../api/axois';
import toast from 'react-hot-toast';

const CommentBox = ({comment,post}) => {
  const [like, setLike] = useState(comment.likes_count)

        const user=useSelector((state)=>state.user.value)
  const handleCommentLike=async(id)=>{

    const token=await getToken();
    const {data}=await api.post('/api/comment/like',
      {
        postId:post._id,commentId:id
      },
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )

    if(data.success)
    {
      setLike((prev)=>{
        if(prev.some((likeUser)=>likeUser._id==user._id))
        {
    return  prev.filter((likeUser)=>likeUser._id!==user._id)
        }
        else{
        return [...prev,user]
        }
      })
      toast.success(data.message)
    }
    else{
      toast.error(data.message)
    }
  }
  const {getToken}=useAuth()
  const navigate=useNavigate();

  return (
  <div
key={comment._id}
className="
group
flex
gap-3
items-start
relative
"
> 
<div className='absolute right-2 top-5 flex justify-center items-center flex-col'>
{
  <Heart  onClick={()=>{
  const id=comment._id;
  handleCommentLike(id);

 }} className={`cursor-pointer size-4 ${like.some(liked=>liked._id==user._id)? 'fill-red-600 duration-150  text-red-600 transition-all':''} `}/>

}
 <p className='text-sm'>{like.length}</p>
</div>
<img  onClick={()=>{

if(user._id==comment.user._id)
{

navigate(`/profile`)
}
else{

navigate(`/profile/${comment.user._id}`)
}
}}
src={comment.user.profile_picture}
alt=""
className="
w-11
h-11
rounded-full
object-cover
ring-2
ring-indigo-100
"
/>

<div className="flex-1">

<div
className="
bg-gray-50
rounded-3xl
px-5
py-3
group-hover:bg-indigo-50
transition
"
>
  <div className='flex gap-2 items-center'>

 

    <h1 className='font-semibold flex gap-1 flex  items-center'>{comment.user.full_name}{comment.user.is_verified && <BadgeCheck className='fill-blue-600 text-white size-4'/>}</h1>
    <p className='text-sm font-light text-gray-600'>{dayjs(comment.createdAt).fromNow()}</p>
     </div>

<p
className="
text-gray-700
break-words
"
>
{comment.comment}
</p>

</div>

</div>

</div>
  )
}

export default CommentBox
