import mongoose from "mongoose";
const connectDb=async()=>{
  try{

  
     mongoose.connection.on("connected",()=>{
      console.log("Connected to database")
     })
   await mongoose.connect(process.env.MONGO_URI)
    }
    catch(err)
    {
      console.log(err.message)
    }

}
export default connectDb