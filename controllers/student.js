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