import Whisky from "./models/whisky.js"
import ExpressError from "./utils/ExpressError.js"
import { whiskyJoiSchema, reviewSchema } from "./ErrorSchema.js"
import Review from "./models/reviews.js"

export const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // Store the URL the user was trying to access
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/login')
    }

    next();
}

export const setCurrentUser = (req, res, next) => {
    res.locals.currentUser = req.user || null;
    next();
}

export const storeReturnTo = (req, res, next) => {
    if(!req.session.returnTo && req.originalUrl !== '/login') { 
        req.session.returnTo = req.originalUrl;
    } 
    
    res.locals.returnTo = req.session.returnTo;



    next();
}

export const validateWhiskies = (req, res, next) => {
    const {error} = whiskyJoiSchema.validate(req.body);

    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

export const isUser = async (req, res, next) => {
    const {id} = req.params;
    const whisky = await Whisky.findById(id);
    if(!whisky.user.equals(req.user._id)) {
        req.flash('error', 'You cannot do that.')
        return res.redirect(`/whiskies/${id}`)
    }
    next();
}

export const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

export const isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.user.equals(req.user._id)) {
        req.flash('error', 'Not Allowed')
        return res.redirect(`/whiskies/${id}`)
    }
    next();
}