const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 2000
    },
    industryName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Industry',
        required: true
    },
    openings: {
        type: Number,
        default: 0
    },
    count_of_placed_students: {
        type: Number,
        default: 0
    },
    pic: {
        type: Object,
        default: {
            cloudinary_url: 'https://res.cloudinary.com/dexkk3lc4/image/upload/v1600092496/default_company.jpg',
            cloudinary_id: 'default_company'
        }
    },
    questions: [
        {
            text: String,
            submitted_by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student', 
            },
            date: {
                type: Date,
                default: Date.now
            }  
        }
    ]
}, {
    timestamps: true
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;