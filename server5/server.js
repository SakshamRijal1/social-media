import express from "express";
import connectDB from "./config/db.js"
import {inngest,functions} from "./inngest/index.js"
import {serve} from "inngest/express"
import cors from 'cors'
import 'dotenv/config'
await connectDB();
const app=express();
app.use(express.json());
app.use(cors());
app.use("/api/inngest",serve({client:inngest,functions}));
app.get('/',(req,res)=>{
  res.send("Servre is running");
})
app.listen(process.env.PORT||4000,()=>{
  console.log(`Server is running on port ${process.env.PORT||4000}`);
})
