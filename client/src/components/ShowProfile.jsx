import React from 'react'

const ShowProfile = ({image,setShowProfile,setEdit}) => {

  return (
    <div className='bg-black/80 backdrop-blur-lg w-full h-screen  fixed left-0 top-0 z-200  items-center flex flex-col gap-2 justify-center'>
  

      
<img className=' w-120 h-120 object-cover'  src={image} alt="" />
<button onClick={()=>{
  setShowProfile(false)
  setEdit(true)

}} className='cursor-pointer hover:scale-95 duration-300 transition-all shadow  bg-indigo-600 px-4 py-1 rounded-md text-white'>Change Profile Picture</button>
<button onClick={()=>{
  setShowProfile(false)
}} className=' cursor-pointer hover:scale-95 duration-300 transition-all shadow bg-red-600 px-4 py-1 rounded-md text-white'>Close</button>

    </div>
  )
}

export default ShowProfile
