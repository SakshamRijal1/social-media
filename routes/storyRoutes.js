import express from "express"
import { protect } from "../middleware/auth.js";
import addStory from "../controllers/storyController.js";
import { upload } from "../config/multer.js";
const storyRouter=express.Router();
storyRouter.post('/add',protect,upload.fields([
  {
    name:"story",
    maxCount:1
  }
]),addStory);
export default storyRouter