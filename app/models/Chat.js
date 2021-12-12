const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
    },
    message: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },

})

// Create Schema
const ChatSchema = new Schema({
    message: {
        type: [MessageSchema]
    },
    members: {
        type: [mongoose.Types.ObjectId]
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});





module.exports = Chat = mongoose.model("chats", ChatSchema);

