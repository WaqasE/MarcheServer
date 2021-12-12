const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { User } = require('../models/');
const { UserSchema, SafePromise, ChatSchema } = require('../utils/');
const salt = bcrypt.genSaltSync(10);

class ChatController {
    constructor() {
    }

    async startChat(req, res) {
        // const data = _.pick(req.body, ['name', 'username', 'email', 'password', 'type', 'os']);
        const { error } = UserSchema.validate(data);
    }

    async inbox(req, res) {
        const { io } = req;
    }

    async chatting(req, res) {
        const { username } = req.params;

    }


}

module.exports = new ChatController();