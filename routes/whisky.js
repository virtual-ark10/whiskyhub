import express from "express";
import mongoose from "mongoose";
import Whisky from "../models/whisky.js";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, validateWhiskies, isUser } from "../middleware.js";
import whiskies from "../controllers/whiskies.js";
import multer from "multer";
import storage from "../cloudinary/index.js"


const router = express.Router();

const upload = multer({storage})

router.route('/')
    .get(catchAsync(whiskies.indexPage))
    .post(isLoggedIn, isUser, validateWhiskies, catchAsync(whiskies.saveWhisky))
  


router.get('/new', isLoggedIn, catchAsync(whiskies.newWhisky))


router.route('/:id')
    .get(isLoggedIn, catchAsync(whiskies.showWhisky))
    .put(isLoggedIn, isUser, validateWhiskies, catchAsync(whiskies.editWhisky))
    .delete(isLoggedIn, isUser, catchAsync(whiskies.deleteWhisky))

router.get('/:id/edit', isLoggedIn, isUser, catchAsync(whiskies.renderEditPage))



export default router;