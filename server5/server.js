import express from "express";
import 'dotenv/config'
import cors from 'cors';
import connectDb from "./config/db.js";


import { functions, inngest } from "./inngest/index.js";
import {clerkMiddleware} from '@clerk/express'
import {serve} from "inngest/express"
import userRouter from "./routes/userRoutes.js"
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import commentRouter from "./routes/commentRoutes.js";

await connectDb();


const app=express();
app.use(express.json());
app.use(cors())
app.use(clerkMiddleware())
app.use("/api/user",userRouter);
app.use("/api/message",messageRouter);
app.use("/api/post",postRouter);
app.use("/api/story",storyRouter);
app.use("/api/comment",commentRouter);
app.use("/api/inngest",serve({
  client:inngest,functions
}))
app.get(('/'),(req,res)=>{
  res.send('Running backend')
  
});
app.listen(process.env.PORT || 3000,()=>{
  console.log(`Running at port ${process.env.PORT || 3000} `);
})