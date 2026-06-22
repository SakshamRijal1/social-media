import React, { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router'
import { dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';
import Stories from '../components/Stories';
import Post from '../components/Post';
import Sponsered from '../components/Sponsered';
import RecentMessage from '../components/RecentMessage';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getToken, useAuth } from '@clerk/react';
import toast from 'react-hot-toast';
import api from '../api/axois';
import { useSelector } from 'react-redux';

const Feed = () => {
  const [feeds,setfeeds]=useState([]);

  const [load, setLoad] = useState(true);
  
  const {getToken}=useAuth()
const story=useRef(null)
  const fetchFeeds=async()=>{
      const token=await getToken();
      try{

        const {data}=await api.get('/api/post/feed',{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        if(data.success)
          
        {
     
          setfeeds(data.posts);

          
        }
        else{
          toast.error(data.message)
        }

      }
      catch(err)
      {
        toast.error(err.message)
      }
    setLoad(false);
  }

  useEffect(()=>{
fetchFeeds();
  },[])
  return!load ? (


  


    
    <div className='h-full w-full   overflow-y-auto no-scrollbar  items-start  xl:gap-8  lg:p-10 grid xl:grid-cols-[2fr_1fr] justify-center   relative '>
      {}
<div className='truncate  flex-nowrap max-w-4xl'>
 
 
  <Stories/>
  
    <div className="flex justify-center  px-4 flex-col gap-4">


{ feeds.length >0 ?

  feeds.map((post,index)=>(
    <Post key={index} item={post} />
  )) :
  <p className='text-gray-500 font-light text-center my-10'>No post found.Add your connections and followers to get feed.</p>
}
</div>

</div>
<div className='py-10 max-xl:hidden  h-screen  w-96 flex flex-col gap-10 '>
<Sponsered/>
<RecentMessage/>
</div>


    </div>

    
  ):<Loading/>
}

export default Feed
