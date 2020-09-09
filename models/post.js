const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: true
    },
    pic: {
        type: Object,
        default: {}
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    comments: [
        {
            text: String,
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;