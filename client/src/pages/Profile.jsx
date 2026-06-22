  import React, { useEffect, useRef, useState } from 'react'
  import { dummyConnectionsData, dummyPostsData } from '../assets/assets'
  import { BadgeCheck, Calendar, Edit, MapPin } from 'lucide-react'

    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
import Post from '../components/Post'
import Loading from '../components/Loading'
import { useNavigate, useParams } from 'react-router'
import EditProfile from '../components/EditProfile'
import { useSelector } from 'react-redux'
import { getToken, useAuth } from '@clerk/react'
import toast from 'react-hot-toast'
import api from '../api/axois.js'
import ShowProfile from '../components/ShowProfile.jsx'
  const Profile = () => {
const {id}=useParams()

const currentUser=useSelector((state)=>state.user.value)  
const [likes, setLikes] = useState(0)
const [edit, setEdit] = useState(false)
const [showProfile, setShowProfile] = useState(false)
const [posts, setPosts] = useState([]);
 const list=[
    "Post",
    "Media",
    "Likes"
  ]
    const [status, setStatus] = useState(list[0]);
    const [width, setWidth] = useState(0)
const [load, setLoad] = useState(true);
const progressTimeout = useRef(null);
const progressInterval = useRef(null);
const navigate=useNavigate()
 
const [item, setItem] = useState(null)
    const {getToken}= useAuth()




useEffect(()=>{
    const fetchUser=async(id)=>{

    const token=await getToken();


    try{
const {data}=await api.post(`/api/user/profiles`,
  {
  id
  },{
  headers:{
    Authorization:`Bearer ${token}`
  }
  

})

  if(data.success)
  {
  
    setItem(data.profile)
setPosts(data.posts)

  }
  else {
    toast.error(data.message)
  }
  
    }
    catch(err)
    {
  toast.error(err.message)
    }
      setLoad(false);

  }

if(id)
{

   fetchUser(id)
}
else{
 fetchUser(currentUser._id)
}



},[id,currentUser])




  dayjs.extend(relativeTime);


    


    return load ? <Loading/> : (
      <>


  <div className='md:p-10 p-3 w-full overflow-x-hidden flex justify-center items-center flex-col gap-5 relative'>


    <div className=' rounded-lg w-full max-h-screen bg-white min-h-120 relative '>
      <div className=' max-h-screen w-full bg-gradient-to-r from-purple-600  to-pink-600 rounded-t-lg h-60 '>
        {
item.cover_photo &&
        
 <img className='w-full h-full object-cover rounded-t-lg' src={item?.cover_photo} alt="" />
        }


      </div>

      <div className='flex  gap-3 mt-5 max-lg:flex-col justify-between  '>
        <div className='absolute  top-[30%]  max-lg:top-[25%] ml-5'>
  <img onClick={()=>{
setShowProfile(true)
  }} className='w-40 h-40 rounded-full border-4 border-amber-50 cursor-pointer object-cover' src={item?.profile_picture} alt="" />
        </div>
        <div className='max-lg:ml-0 max-lg:mt-15 p-3 ml-50 w-full '>
          <div className=''>
    <h1 className='font-semibold text-xl items-center flex gap-1'>{item?.full_name}{item?.is_verified && <BadgeCheck className=' fill-blue-600 text-white text-sm size-5 '/>}</h1>
  <p className='text-gray-500'>@{item?.username}</p>
          </div>
          <div>
            <p className='text-gray-600 text-sm'>{item?.bio}</p>

            <div className='mt-5 flex  gap-4 text-gray-700 max-sm:flex-col'>
              {
                item.location &&   <button className=' gap-1 flex rounded-xl  items-center justify-center px-3 py-0.5 text-sm ' ><MapPin/>{item?.location}</button>
              }
            
              <button className=' gap-1 flex rounded-xl  items-center justify-center px-3 py-0.5 text-sm ' ><Calendar/> Joined <span className='font-semibold'>{dayjs(item?.createdAt).fromNow()}</span></button>
            </div>
            <hr  className='text-gray-300 mt-5'/>
            <div className='flex gap-4 mt-2 text-gray-800'>
              <h1 className='flex gap-1'>{posts.length} <span className='font-semibold'>Posts</span></h1>
                <h1 className='flex gap-1'>{item.followers.length} <span className='font-semibold'>Followers</span></h1>
                  <h1 className='flex gap-1'>{item.following.length} <span className='font-semibold'>Following</span></h1>
            </div>
          </div>

        </div>
        <div>

        </div>
{
  !id && <div className=' p-3 max-lg:w-full '>
          <button onClick={()=>{
  setEdit(true)
          }} className='flex max-lg:w-full transition-all duration-200 hover:scale-95 rounded-lg hove:shadow px-4 py-1 shadow  cursor-pointer  gap-2 justify-center items-center'> <Edit/>Edit</button>
        </div>
}
       
      </div>
    </div>


    <div className='shadow w-96 p-2  flex justify-between rounded-lg'>

{
  list.map((item,index)=>(
    <button onClick={()=>{
      setStatus(item)
    }} className={`cursor-pointer px-5 py-1 rounded-lg transition-all duration-500 ${item==status ? "bg-indigo-600 text-white":"text-gray-700"} `} key={item}>
{item}

    </button>
  ))
}
    </div>
    {
      status=="Post" &&     <div className="flex justify-center p-2 max-w-4xl  flex-col gap-2">

{
  posts?.length==0 && <p className='text-gray-600'>No post found!!</p>
}
{

posts.map((post,index)=>(
    <Post  key={index} item={post}/>
  ))
}
</div>
    }
    {
      status=="Media" &&     <div className="flex flex-wrap w-full gap-2 shadow p-2 rounded ">

{
  posts?.length==0 && <p className='text-gray-600'>No media found!!</p>
}
{


  posts.map((post,index)=>(

<>
{
  post.image_urls.length==1   &&  <img onClick={()=>{
    navigate(`/seepost/${post._id}`)
  }} className='w-50   h-40 object-cover rounded' key={post} src={post.image_urls[0]} alt="" />
  }
{
  post.image_urls.length>1 && 
  post.image_urls.map((url,index)=>(
    <img onClick={()=>{
    navigate(`/seepost/${post._id}`)
  }} className='w-50   h-40 object-cover rounded' key={url} src={url} alt="" />
  ))
  }
</>
  ))
}
</div>
    }
    {
      status=="Likes" &&     <div className="flex justify-center  px-4 flex-col gap-4">


   <p className='text-gray-600'>Total likes is <span className='font-semibold'>{likes}</span> for this account</p>


</div>
    }


        
      </div>


      {  edit &&
        <EditProfile  setEdit={setEdit} details={item} />
      }
      {
        showProfile && <ShowProfile image={item.profile_picture} setEdit={setEdit} setShowProfile={setShowProfile}/>
      }


      </>
    )
  }

  export default Profile
