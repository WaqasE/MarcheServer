const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BidSchema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
    },
    bid: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },

})

const GigSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    user: {
        type: mongoose.Types.ObjectId
    },
    thumbnail: {
        type: String
    },
    tags: {
        type: Array
    },
    bids: {
        type: [BidSchema]
    }

})


module.exports = Gig = mongoose.model("gigs", GigSchema);

