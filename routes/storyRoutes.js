import express from "express"
import { protect } from "../middleware/auth.js";

import { upload } from "../config/multer.js";
import { addStory, getUserStory } from "../controllers/storyController.js";
const storyRouter=express.Router();
storyRouter.post('/add',protect,upload.fields([
  {
    name:"story",
    maxCount:1
  }
]),addStory);
storyRouter.get('/feed',protect,getUserStory)
export default storyRouter