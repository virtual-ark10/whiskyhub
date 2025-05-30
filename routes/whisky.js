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
    .post(validateWhiskies, catchAsync(whiskies.saveWhisky))
    // .post(upload.array('image'), (req, res) => {
    //     res.status(200).send({body: req.body, file:req.files})
    //})


router.get('/new', catchAsync(whiskies.newWhisky))


router.route('/:id')
    .get(isLoggedIn, catchAsync(whiskies.showWhisky))
    .put(isLoggedIn, isUser, upload.array('image'), validateWhiskies, catchAsync(whiskies.editWhisky))
    .delete(isLoggedIn, isUser, catchAsync(whiskies.deleteWhisky))

router.get('/:id/edit', isLoggedIn, isUser, catchAsync(whiskies.renderEditPage))



export default router;