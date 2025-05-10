import express from "express";
import catchAsync from "../utils/catchAsync.js";
import Whisky from "../models/whisky.js"
import Review from "../models/reviews.js"
import { isLoggedIn } from "../middleware.js";
import { validateReview, isReviewAuthor } from "../middleware.js";
import reviews from "../controllers/reviews.js"


const router = express.Router({mergeParams: true});


router.post('/', validateReview, catchAsync(reviews.saveReview))

router.get('/:reviewId/edit', isLoggedIn, catchAsync(reviews.editReviewPage))

router.put('/:reviewId', validateReview, catchAsync(reviews.updateReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

export default router;