import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
    body: String,
    rating: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

const Review = mongoose.model('Review', reviewsSchema);

export default Review;