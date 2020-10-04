const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const sgMail = require('@sendgrid/mail');

const Student = require('../models/student');
require('dotenv').config();

const sendgridApiKey = 'SG.' + process.env.SEND_GRID_API;
sgMail.setApiKey(sendgridApiKey);

exports.signup = async(req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();

        await sgMail.send({
            to: student.email,
            from: 'no-reply@collegeplacementforum.com',
            subject: 'Thanks for joining!',
            text: `Welcome to the app, ${student.name}. Explore companies and discuss placements.`
        });

        res.status(201).json({
            student
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
};

exports.signin = async(req, res) => {
    try {
        const student = await Student.findByCredentials(req.body.email, req.body.password);
        const token = jwt.sign({ _id: student._id.toString() }, process.env.JWT_SECRET);

        // persist the token as 't in cookie with expiry date
        res.cookie('t', token, {
            expire: new Date() + 999
        });

        const {_id, name, email, role, block_status} = student;
        
        if(block_status === 1) {
           return res.status(400).json({
                error: 'User is blocked!!!'
            });
        }

        res.status(202).json({
            student: {_id, name, email, role},
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

exports.requiredSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    let student = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!student) {
        return res.status(401).json({
            error: 'Access denied'
        });
    };
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(401).json({
            error: 'Admin resource! Access denied'
        });
    }
    next();
};