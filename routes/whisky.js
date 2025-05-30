import express from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, validateWhiskies, isUser } from "../middleware.js";
import whiskies from "../controllers/whiskies.js";



const router = express.Router();


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