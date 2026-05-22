import express from "express";
import 'dotenv/config'
import cors from 'cors';
import connectDb from "./config/db.js";

import { functions, inngest } from "./inngest/index.js";
import {serve} from "inngest/express"
await connectDb()

const app=express();
app.use(express.json());
app.use(cors())
app.use("/api/inngest",serve({
  client:inngest,functions
}))
app.get(('/'),(req,res)=>{
  res.send('Running backend')
  
});
app.listen(process.env.PORT || 4000,()=>{
  console.log("Running at prot 4000");
})