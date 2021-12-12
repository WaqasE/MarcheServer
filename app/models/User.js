const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        default: ''
    },
    skills: {
        type: Array
    },
    tokens: {
        type: [
            {
                token: String,
                device: String,
                loggedInAt: Date
            }
        ],
        default: []
    },
    profilePicture: {
        type: String,
        default: ''
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





module.exports = User = mongoose.model("users", UserSchema);

