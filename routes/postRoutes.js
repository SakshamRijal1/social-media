import express from "express"
import { protect } from "../middleware/auth.js";
import { upload } from "../config/multer.js";
import { addPost, getFeedPost, likePost } from "../controllers/postController.js";
const postRouter=express.Router();
postRouter.post('/add',upload.array('images',4),protect,addPost)
postRouter.get('/feed',protect,getFeedPost)
postRouter.post('/like',protect,likePost)
export default postRouter