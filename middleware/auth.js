
//this is the middleware to protect the route and check if the user is authenticated or not .
export const protect=async(req,res,next)=>{
  try{
    const {userId}=await req.auth();
    if(!userId)//to protect route
    {
      return res.json({
        success:false,
        message:"Not authenticated"
      })
    }
    next()
  }
  catch(err)//to protecet route
  {
 return res.json({
        success:false,
        message:err.message
      })
  }
}