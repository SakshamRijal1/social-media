import express from "express"
import { protect } from "../middleware/auth.js";

import { upload } from "../config/multer.js";
import { addStory, getUserStory, handleView } from "../controllers/storyController.js";
const storyRouter=express.Router();
storyRouter.post('/add',protect,upload.single('story'),addStory);
storyRouter.get('/feed',protect,getUserStory)
storyRouter.post('/see',protect,handleView)
export default storyRouter