import mongoose from 'mongoose';
const commentSchema=new mongoose.Schema({
  user:{
    ref:"User",
    type:String,

    required:true

  },
  post:{
    ref:"Post",
    type:String,
    required:true,
  },
  comment:{
    type:String,
  },
  likes_count:[
    {
      type:String,
      ref:"User"
    }
  ]





},
{
  timestamps:true,
  minimize:false
})

const Comment=mongoose.model('Comment',commentSchema);
export default Comment;