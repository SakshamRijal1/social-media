import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
export const addComment=async(req,res)=>{
  try{
    const {userId}=req.auth();
    
    const {postId,comment}=req.body;
    const post=await Post.findById(postId)
  if(post)
  {
    let commentUser=await Comment.create({
      user:userId,
      post:postId,
      comment
    });
    commentUser=await commentUser.populate('user')


    res.json({
      success:true,
      message:'Comment added successfully',
      commentUser
    })
  }
  else{
    return res.json({
      success:false,
      message:"Post donot exists."
    })
  }




  }
  catch(err)
  {
    res.json({
      success:false,
      message:err.message
    })
  }
}

export const addLikeComment=async(req,res)=>{
  try{
    const {userId}=req.auth();
    const {postId,commentId}=req.body;

const post=await Post.findById(postId)
if(!post)
{
  return res.json(
    {
      success:false,
      message:"Post doesnot exists."
    }
  )
}


const comment=await Comment.findById(commentId);
console.log(comment)

if(comment.likes_count.includes(userId))
{
  comment.likes_count=comment.likes_count.filter((id)=>id!==userId)
  await comment.save();
  res.json({
    success:true,
    message:'Unliked Comment'
  })
}
else
{
  comment.likes_count.push(userId);
  await comment.save();
    res.json({
    success:true,
    message:'Liked Comment'
  })
}



  }




  
  catch(err)
  {
    res.json({
      success:false,
      message:err.message
    })
  }
}

export const fetchComment=async(req,res)=>{
  try
  {

    const {userId}=req.auth();
  
    const {postId}=req.body;


    const post=await Post.findById(postId);
    if(post)
    {
      const comment=await Comment.find({
        post:postId,
      }).populate('likes_count user').sort({createdAt:-1})

      res.json({
        success:true,
        message:"Successfully fetched comments.",
        comment
      })
    }
    else{
      return res.json({
        success:false,
        message:"Post doesnot exist."
      })
    }


  }
  catch(err)
  {

  }
}