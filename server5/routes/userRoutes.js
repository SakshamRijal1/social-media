import express from "express";
import {discoverUsers, followUsers, getUserData, getUserProfile, unfollowUsers, updateUserData} from '../controllers/userController.js'
import {protect} from '../middleware/auth.js'
import { upload } from "../config/multer.js";
import { sendConnectionRequest } from "../controllers/userController.js";
import { getUserConnections } from "../controllers/userController.js";
import { acceptConnectionRequest } from "../controllers/userController.js";
import { getUserRecentMessages } from "../controllers/messageController.js";
const userRouter=express.Router();

userRouter.get('/data',protect,getUserData);

userRouter.get('/recent-messages',protect,getUserRecentMessages);

userRouter.post('/update',protect,upload.fields([{
  name:'profile',
  maxCount:1
},
{name:"cover",
  maxCOunt:1

}]),updateUserData);//multer is the middleware to handle file upload which can parse
userRouter.get('/discover',protect,discoverUsers);
userRouter.post('/follow',protect,followUsers);
userRouter.post('/unfollow',protect,unfollowUsers);
userRouter.post('/connect',protect,sendConnectionRequest)
userRouter.get('/connections',protect,getUserConnections)
userRouter.get('/accept',protect,acceptConnectionRequest)
userRouter.post('/profiles',protect,getUserProfile)

export default userRouter