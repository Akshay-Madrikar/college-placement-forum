const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Please enter your email address'],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Please enter proper email address!');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if(validator.contains(value.toLowerCase(),'password')){
                throw new Error('Your password must not contain password in it!');
            }
        }
    },
    role: {
        type: Number,
        default: 0
    },
    appliedJobHistory: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

// Hash password before saving to database
studentSchema.pre('save', async function(next) {
    const student = this;

    if(student.isModified('password')) {
        student.password = await bcryptjs.hash(student.password, 8);
    }
    next();
});

// Remove specific field from response
studentSchema.methods.toJSON = function() {
    const student = this;
    const studentObject = student.toObject()

    delete studentObject.password;

    return studentObject;
};

// To find student by emailId
studentSchema.statics.findByCredentials = async(email, password) => {
    const student = await Student.findOne({ email });

    if(!student) {
        throw new Error();
    };

    const isMatch = await bcryptjs.compare(password, student.password);
    if(!isMatch) {
        throw new Error();
    };

    return student;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

