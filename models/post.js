const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    pic: {
        type: Object,
        default: {}
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student'
            }
        }
    ],
    comments: [
        {
            text: String,
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student'
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