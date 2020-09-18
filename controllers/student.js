const Student = require('../models/student');

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
        res.status(200).json(req.profile);
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

        if(pic) userFields.pic = pic

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