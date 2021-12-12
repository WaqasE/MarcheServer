const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { User } = require('../models/');
const { UserSchema, SafePromise } = require('../utils/');
const salt = bcrypt.genSaltSync(10);

class AuthController {
    constructor() {
    }


    async login(req, res) {
        const data = _.pick(req.body, ['email', 'password', 'type', 'os']);
        // const { error } = UserSchema.validate(data);
        // if (error)
        //     next({
        //         status: 400,
        //         msg: error.details[0].message
        //     })

        // const userExist = await User.findOne(data.email ? { email: data.email } : { username: data.username })
        // if (!userExist)
        //     next({
        //         status: 400,
        //         msg: 'User not found!'
        //     })
        // const hashedPass = await bcrypt.compare(data.password, userExist.password);
        // if (!hashedPass)
        //     next({
        //         status: 400,
        //         msg: 'Incorrect Username/email or password!'
        //     })
        // const accessToken = jwt.sign({ id: userExist._id, name: userExist.name, username: userExist.username, email: userExist.email }, process.env.JWTPRIVATEKEY, { expiresIn: '60min' });
        // const refreshToken = jwt.sign({ id: userExist._id }, process.env.JWTPRIVATEKEY, { expiresIn: '15d' });
        // await User.updateOne(
        //     { _id: userExist._id },
        //     { $set: { tokens: [...userExist.tokens, { token: refreshToken, os: data.os, loggedInAt: new Date() }] } })
        // return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken });
        return res.status(200).send({ user: data });
    }



    async signup(req, res) {
        const data = _.pick(req.body, ['name', 'username', 'email', 'password', 'type', 'os']);
        const { error } = UserSchema.validate(data);
        if (error)
            next({
                status: 400,
                msg: error.details[0].message
            })

        const userExist = await User.findOne({ email: data.email, username: data.username, })
        if (userExist)
            next({
                status: 400,
                msg: 'Email or Username already exists!'
            })
        const hashedPass = await bcrypt.hash(data.password, salt);
        const user = await new User({ name: data.name, username: data.username, email: data.email, password: hashedPass, type: data.type })
        if (!user)
            next({
                status: 500,
                msg: 'internal server error!'
            })
        const accessToken = jwt.sign({ id: user._id, name: user.name, username: user.username, email: user.email }, process.env.JWTPRIVATEKEY, { expiresIn: '60min' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWTPRIVATEKEY, { expiresIn: '15d' });
        user.tokens = [{ token: refreshToken, os: data.os, loggedInAt: new Date() }]
        await user.save();
        return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken });

    }



    async me(req, res) {

    }



    async logout(req, res) {
        const data = _.pick(req.body, ['refreshToken', 'os']);

        const decoded = await SafePromise(jwt.verify(data.refreshToken, process.env.JWTPRIVATEKEY));
        const userExist = await User.findOne({ _id: decoded.id })
        if (!userExist)
            next({
                status: 400,
                msg: 'Invalid Token'
            })
        const index = userExist['tokens'].findIndex(
            (item) => (item.token === data.refreshToken && item.os === data.os)
        )

        console.log(index)
        if (!index || index === -1)
            next({
                status: 400,
                msg: 'Invalid Token'
            })

        const updatedTokenList = userExist['tokens'].splice(index, 1);
        userExist['tokens'] = updatedTokenList
        userExist.save()
        return res.status(200).send('user logged out succesfully');
    }


    async token(req, res) {
        const data = _.pick(req.body, ['refreshToken', 'os']);

        const decoded = await SafePromise(jwt.verify(data.refreshToken, process.env.JWTPRIVATEKEY));
        const userExist = await User.findOne({ _id: decoded.id })
        if (!userExist)
            next({
                status: 400,
                msg: 'Invalid Token'
            })
        const index = userExist['tokens'].findIndex(
            (item) => (item.token === data.refreshToken && item.os === data.os)
        )

        if (!index)
            next({
                status: 400,
                msg: 'Invalid Token'
            })

        const accessToken = jwt.sign({ id: userExist._id, name: userExist.name, username: userExist.username, email: userExist.email }, process.env.JWTPRIVATEKEY, { expiresIn: '60min' });
        return res.status(200).send({ accessToken: accessToken, refreshToken: data.refreshToken });
    }
}

module.exports = new AuthController();