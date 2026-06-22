import { getToken, useAuth } from '@clerk/react'
import { Heart, LucideMessageCircleWarning, SendHorizonalIcon, SendIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/axois'
import toast from 'react-hot-toast'
import CommentBox from './CommentBox'
import { useEffect } from 'react'

const CommentModel = ({post,setComment,comments,setUserComments}) => {

  const {getToken}=useAuth()
  const commentUser=useRef("");

const handleSubmit=async(e)=>{
  e.preventDefault()
const token=await getToken();
if(commentUser.current.value.length==0)
{
return toast.error('Comment cannot be empty.')
}

const {data}=await api.post('/api/comment/add',{
  comment:commentUser.current.value,
  postId:post._id
},{
  headers:{
    Authorization:`Bearer ${token}`
  }
})
if(data.success)
{
  console.log(data.commentUser)
   setUserComments((value)=>[data.commentUser,...value])
  toast.success(data.message);
  commentUser.current.value=""

}
else{
  toast.error(data.message)
}
}


  const user=useSelector((state)=>state.user.value);



return (
<div className="w-full max-w-2xl mx-auto">

<div
className="
bg-white/90
backdrop-blur-lg
rounded-3xl
shadow-2xl

overflow-hidden
"
>

{/* HEADER */}
<div className="px-6 py-5 border-b flex items-center gap-3">

<div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
<LucideMessageCircleWarning
size={20}
className="text-indigo-600"
/>
</div>

<div>
<h1 className="font-bold text-lg">
Comments
</h1>

<p className="text-sm text-gray-500">
{comments.length} comments
</p>
</div>

</div>

{/* COMMENT BODY */}

<div
className="
max-h-[420px]
overflow-y-auto
p-5
space-y-5
"
>

{comments.length === 0 ? (

<div className="py-20 flex flex-col items-center">

<div
className="
w-20
h-20
rounded-full
bg-indigo-100
flex
items-center
justify-center
"
>

<LucideMessageCircleWarning
size={38}
className="text-indigo-600"
/>

</div>

<h2 className="font-semibold mt-4">
No comments yet
</h2>

<p className="text-gray-500 text-sm">
Start the conversation ✨
</p>

</div>

) : (

comments.map((comment) => (

<CommentBox    post={post} comment={comment}/>

))

)}

</div>

{/* INPUT */}

<form
onSubmit={handleSubmit}
className="
border-t
bg-white
sticky
bottom-0
p-4
"
>

<div className="flex gap-3 items-center">

<img
src={user.profile_picture}
alt=""
className="
w-11
h-11
rounded-full
object-cover
"
/>

<div className="relative flex-1">

<input
ref={commentUser}
placeholder={`Comment as ${user.full_name}`}
className="
w-full
rounded-full
bg-gray-100
focus:bg-white
px-5
py-3
pr-16
outline-none
focus:ring-2
focus:ring-indigo-500
transition
"
/>

<button
type="submit"
className="
absolute
right-2
top-1/2
-translate-y-1/2

w-10
h-10

bg-indigo-600
hover:bg-indigo-700

rounded-full

text-white

flex
items-center
justify-center

transition
hover:scale-110
"
>

<SendHorizonalIcon size={18} />

</button>

</div>

</div>

</form>

{/* FOOTER */}

<div className="py-3 flex justify-center">

<button 
onClick={() => setComment(false)}
className="
text-sm
text-gray-500
hover:text-red-500
transition
cursor-pointer
"
>

Hide comments

</button>

</div>

</div>

</div>
)

}

export default CommentModel
