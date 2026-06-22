import { createBrowserRouter, Navigate } from "react-router"

import { RouterProvider } from "react-router"
import Login from "./pages/Login"
import Feed from "./pages/Feed"
import Messages from "./pages/Messages"
import ChatBox from "./pages/ChatBox"
import Connections from "./pages/Connections"
import Discover from "./pages/Discover"
import CreatePost from "./pages/CreatePost"
import { useUser ,useAuth} from "@clerk/react"
import Layout from "./pages/Layout"
import { useEffect, useState } from "react"
import Profile from "./pages/Profile"
import Loading from "./components/Loading"
import {Toaster} from 'react-hot-toast'
import Seepost from "./components/Seepost"
import { useDispatch } from "react-redux"
import { fetchUser } from "./features/user/userSlice.js"

function App() {
const {user,isLoaded}=useUser();
const {getToken}=useAuth();
const dispatch=useDispatch()
useEffect(()=>{
const fetchData=async()=>{
if(user)
  {
    const token=await getToken();
    dispatch(fetchUser(token))
    
  }

}
  fetchData();
  
},[user,getToken,dispatch])
if(!isLoaded)
{
  return <Loading/>
}

  


  const router=createBrowserRouter([
{
  path:"/",
  element:!user?<Login/>:<Layout user={user}/>,
  children:[
    {
index:true,
  element:<Feed/>

},
{
  path:'messages',
  element:<Messages/>

},
{
  path:"messages/:id",
  element:<ChatBox/>
},
{
  path:"connections",
  element:<Connections/>
},
{
  path:"discover",
  element:<Discover/>
},
{
  path:"profile/:id",
  element:<Profile/>
}
,
{
  path:"profile",
  element:<Profile/>
}
,


{
  path:"createpost",
  element:<CreatePost/>,
}]
,

},
{
  path:"/seepost/:id",
  element:<Seepost/>
}
,
  ])



  return (
    <>   
    <Toaster/>
 <RouterProvider router={router}>

         </RouterProvider>

    
    </>
  )
}

export default App