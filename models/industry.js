const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 32
    }
}, {
    timestamps: true
});

const Industry = mongoose.model('Industry', industrySchema);

module.exports = Industry;