const crypto = require('crypto');

const Student = require('../models/student');
const { sendBlockEmail, sendUnblockEmail, sendResetPasswordEmail } = require('../emails/account');

exports.studentById = async (req, res, next, id) => {
    try {
        const student = await Student.findById(id).select('-password').exec();
        if(!student) {
            throw new Error();
        };

        req.profile = student;
        next();
    } catch(error) {
        res.status(400).json({
            error: 'No such student!'
        });
    };
};

exports.readProfile = async (req, res) => {
    try {
        req.profile.password = undefined;
        res.status(200).json({ 
            student: req.profile 
        });
    } catch(error) {
        res.status(400).json({
            error: 'No such student!'
        });
    };
};


exports.updateProfile = async(req, res) => {
    let userFields = {};
    try {
        const { formData, pic } = req.body;
        
        if(formData) {
            const { name, email, password} = formData;
            if(name) userFields.name = name
            if(email) userFields.email = email
            if(password) userFields.password = password
        }

        if(pic.cloudinary_id) userFields.pic = pic

        const student = await Student.findByIdAndUpdate(req.profile._id, {
            $set: userFields
        }, {
            new: true
        });
    
        res.status(200).json({
            student
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

exports.list = async (req, res) => {
    try {
        const students = await Student.find({});
        if(!students) {
            throw new Error();
        }

        res.status(201).json(students);
    } catch(error) {
        res.status(400).json({
            error: 'Students not found'
        });
    };
};

exports.block = async(req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.body.studentId, {
            $set: {
                block_status: 1
            }
        }, {
            new: true
        });

        sendBlockEmail( student.email, student.name );
        
        res.status(200).json({
            _id: student._id,
            block_status: student.block_status
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

exports.unblock = async(req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.body.studentId, {
            $set: {
                block_status: 0
            }
        }, {
            new: true
        });
        
        sendUnblockEmail( student.email, student.name );

        res.status(200).json({
            _id: student._id,
            block_status: student.block_status
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

exports.resetPassword = async(req, res) => {
    crypto.randomBytes(32, async (error, buffer) => {
        if(error){
            console.log(error);
        };

        const token = buffer.toString('hex');

        try{
            const student = await Student.findOne({ email: req.body.email })
            if(!student) {
                return res.status(400).json({error: 'No student exists with that email!'});
            }
            student.resetToken = token;
            student.expireToken = Date.now() + 3600000;
            await student.save();
    
            sendResetPasswordEmail(student.email, student.name, token);
    
            res.status(200).json({
                message: 'Check your email!'
            });
        } catch(error) {
            res.status(400).json({
                error: error.message
            });
        }
    });
}

exports.newPassword = async(req, res) => {
    try{
        const newPassword = req.body.password;
        const sentToken = req.body.token;
    
        const student = await Student.findOne({
            resetToken: sentToken,
            expireToken: {
                $gt: Date.now()
            }
        });

        if(!student) {
            return res.status(400).json({error: 'Session expired!'});
        }

        student.password = newPassword;
        student.resetToken = undefined;
        student.expireToken = undefined;

        await student.save();
        res.status(201).json({
            message: 'Password updated successfully!'
        });
    } catch(error) {
        res.status(400).json({
            error: error.message
        });
    }
}