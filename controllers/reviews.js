import Review from "../models/reviews.js";
import Whisky from "../models/whisky.js";

export const saveReview = async(req, res)=>{
    const whisky = await Whisky.findById(req.params.id);
    const review = new Review(req.body.review);
    review.user = req.user._id;
    whisky.reviews.push(review);
    await review.save();
    await whisky.save();
    req.flash('success', 'Successfully added review')
    res.redirect(`/whiskies/${whisky._id}`)
}

export const editReviewPage = async(req, res)=>{
    const {id, reviewId} = req.params;
    const whisky =  await Whisky.findById(id)
    const review = await Review.findById(reviewId)
    res.render('whiskies/editReview', {whisky, review})
}

export const updateReview = async(req, res) => {
    const {id, reviewId} = req.params;
    await Review.findByIdAndUpdate(reviewId, {...req.body.review})
    req.flash('success', 'Review Updated Successfully')
    res.redirect(`/whiskies/${id}`)
}

export const deleteReview = async(req, res) => {
    const {id, reviewId} = req.params;
    await Whisky.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/whiskies/${id}`)
}


export default {saveReview, editReviewPage, updateReview, deleteReview}