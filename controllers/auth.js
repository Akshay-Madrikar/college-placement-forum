const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const User = require('../models/user');
require('dotenv').config();

exports.signup = async(req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({
            user
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
};

exports.signin = async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

        // persist the token as 't in cookie with expiry date
        res.cookie('t', token, {
            expire: new Date() + 999
        });

        const {_id, name, email, role} = user;
        res.status(202).json({
            user: {_id, name, email, role},
            token
        });
    } catch (error) {
        res.status(400).json({
            error: 'Email or password do not match'
        });
    }
};

exports.signout = async(req, res) => {
    try {
        res.clearCookie('t');
        res.status(200).json({
            message: 'Signout sucess!'
        })
    } catch (error) {
        res.status(400).json({
            error
        });
    }
};