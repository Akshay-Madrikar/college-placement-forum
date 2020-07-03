const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8);
    }
    next();
});

// Remove specific field from response
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject()

    delete userObject.password;

    return userObject;
};

// To find user by emailId
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email });

    if(!user) {
        throw new Error();
    };

    const isMatch = await bcryptjs.compare(password, user.password);
    if(!isMatch) {
        throw new Error();
    };

    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

