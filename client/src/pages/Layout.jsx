import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import {Outlet} from 'react-router'
import { dummyUserData } from '../assets/assets'
import {Menu, X} from 'lucide-react'
import Loading from '../components/Loading'
import {useSelector} from 'react-redux'
const Layout = () => {
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
const user=useSelector((state)=>state.user.value)


  return user? (
    <div className='w-full justify-center  flex h-screen'>
    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      <div className='flex-1  bg-slate-50 overflow-x-hidden' >
        <Outlet/>
      </div>
      {
        sidebarOpen?
        <X  onClick={()=>{
          setSidebarOpen(false)
        }} className='absolute top-3 right-3 p-2 z-110 bg-white rounded-md shadow w-10 h-10 cursor-pointer text-gray-600 sm:hidden'/>
        :
        <Menu onClick={()=>{
          setSidebarOpen(true)
        }} className='absolute cursor-pointer top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'/>
      }
      
    </div>
  )
  :<Loading/>
}

export default Layout
