const jwt = require('jsonwebtoken');
const _ = require('lodash');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const { User } = require('../models/');
const { UserSchema, SafePromise } = require('../utils/');
const salt = bcrypt.genSaltSync(10);

class AuthController {
    constructor() {
    }


    async login(req, res) {
        var re = /\S+@\S+\.\S+/;
        const data = _.pick(req.body, ['email', 'password', 'device']);
        const userExist = await User.findOne(re.test(data.email) ? { email: data.email } : { username: data.email })
        if (!userExist) { return res.status(400).send('User not found'); }
        const hashedPass = await bcrypt.compare(data.password, userExist.password);
        if (!hashedPass) {
            return res.status(400).send('Incorrect Username / email or password!');
        }
        const accessToken = jwt.sign({ id: userExist._id, name: userExist.name, username: userExist.username, email: userExist.email, skills: userExist.skills, profilePicture: userExist.profilePicture, }, process.env.JWTPRIVATEKEY, { expiresIn: '60min' });
        const refreshToken = jwt.sign({ id: userExist._id }, process.env.JWTPRIVATEKEY, { expiresIn: '15d' });
        await User.updateOne(
            { _id: userExist._id },
            { $set: { tokens: [...userExist.tokens, { token: refreshToken, os: data.os, loggedInAt: new Date() }] } })
        return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken });
    }


    async skills(req, res) {
        let id = req.params;
        const skills = req.body.skills
        const userExist = await User.findById(mongoose.Types.ObjectId(id));
        if (!userExist) { return res.status(400).send('User not found'); }
        userExist.skills = skills;
        await userExist.save();
        return res.status(200).send('Skills updated sucessfully');
    }

    async profilePicture(req, res) {
        let id = req.params;
        const profilePicture = req.body.profilePicture
        const userExist = await User.findById(mongoose.Types.ObjectId(id));
        if (!userExist) { return res.status(400).send('User not found'); }
        userExist.profilePicture = profilePicture;
        await userExist.save();
        return res.status(200).send('Picture updated sucessfully');
    }



    async signup(req, res) {
        const data = _.pick(req.body, ['name', 'username', 'email', 'password', 'device']);
        const { error } = UserSchema.validate(data);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const userExist = await User.findOne({ email: data.email, username: data.username, })
        if (userExist) {
            return res.status(400).send('Email or Username already exists!');
        }
        const hashedPass = await bcrypt.hash(data.password, salt);
        const user = await new User({ name: data.name, username: data.username, email: data.email, password: hashedPass })
        if (!user) {
            return res.status(500).send('internal server error!');
        }
        const accessToken = jwt.sign({ id: user._id, name: user.name, username: user.username, email: user.email }, process.env.JWTPRIVATEKEY, { expiresIn: '60min' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWTPRIVATEKEY, { expiresIn: '15d' });
        user.tokens = [{ token: refreshToken, device: data.device, loggedInAt: new Date() }]
        await user.save();
        return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken });

    }



    async me(req, res) {

    }



    async logout(req, res) {
        const data = _.pick(req.body, ['refreshToken', 'os']);

        const decoded = await SafePromise(jwt.verify(data.refreshToken, process.env.JWTPRIVATEKEY));
        const userExist = await User.findOne({ _id: decoded.id })
        if (!userExist) { return res.status(400).send('Invalid Token!'); }
        const index = userExist['tokens'].findIndex(
            (item) => (item.token === data.refreshToken && item.os === data.os)
        )
        if (!index || index === -1) {
            return res.status(400).send('Invalid Token!');
        }

        const updatedTokenList = userExist['tokens'].splice(index, 1);
        userExist['tokens'] = updatedTokenList
        userExist.save()
        return res.status(200).send('user logged out succesfully');
    }


    async token(req, res) {
        const data = _.pick(req.body, ['refreshToken', 'os']);

        const decoded = await SafePromise(jwt.verify(data.refreshToken, process.env.JWTPRIVATEKEY));
        const userExist = await User.findOne({ _id: decoded.id })
        if (!userExist) { return res.status(400).send('Invalid Token!'); }
        const index = userExist['tokens'].findIndex(
            (item) => (item.token === data.refreshToken && item.os === data.os)
        )

        if (!index) { return res.status(400).send('Invalid Token!'); }

        const accessToken = jwt.sign({ id: userExist._id, name: userExist.name, username: userExist.username, email: userExist.email }, process.env.JWTPRIVATEKEY, { expiresIn: '60min' });
        return res.status(200).send({ accessToken: accessToken, refreshToken: data.refreshToken });
    }
}

module.exports = new AuthController();