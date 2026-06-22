import express from 'express';
import { protect } from '../middleware/auth.js';
import { addComment,addLikeComment, fetchComment} from '../controllers/commentController.js';
const commentRouter=express.Router();
commentRouter.post('/add',protect,addComment);
commentRouter.post('/like',protect,addLikeComment);
commentRouter.post('/get',protect,fetchComment);
export default commentRouter;