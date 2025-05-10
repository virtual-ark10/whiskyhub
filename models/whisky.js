import mongoose from "mongoose"
import Review from "./reviews.js";

const Schema = mongoose.Schema;

const whiskySchema = new Schema({
    name: String,
    type: String,
    price: Number,
    image: String,
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

whiskySchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


const Whisky = mongoose.model('Whisky', whiskySchema);

export default Whisky;