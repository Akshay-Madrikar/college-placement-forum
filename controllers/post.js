const Post = require('../models/post');

exports.postById = async(req ,res, next, id) => {
    try{
        const post = await Post.findById(id).populate('postedBy').populate('comments.postedBy').exec();
        if(!post) {
            throw new Error();
        }
        req.post = post;
        next();
    } catch(error) {
        res.status(404).json({
            error: 'No such post!'
        });
    }
};

exports.create = async(req, res) => {
    try {
        const { text, pic } = req.body;
        const post = new Post({ text, pic, postedBy: req.profile });
        await post.save();
        res.status(201).json({
            post,
            message: 'Post created successfully!'
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
};

exports.read = async(req, res) => {
    return res.status(200).json({post: req.post});
};

exports.remove = async (req, res) => {
    try {
        const post = req.post;
        const {_id, postedBy} = post;
        await post.remove();
        res.status(200).json({
            post: {_id, postedBy},
            message: 'Post deleted successfully!'
        });
    } catch(error) {
        res.status(400).json({
            error
        });
    };
};

exports.list = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 }).populate('postedBy');
        if(!posts) {
            throw new Error();
        }

        res.status(200).json(posts);
    } catch(error) {
        res.status(400).json({
            error: 'Posts not found'
        });
    };
};

exports.like = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.post._id, {
            $push: { likes: req.profile._id }    // Push likes into particular posts
        }, {
            new: true    //To get updated data
        })
        .populate('comments.postedBy', '_id username')
        .populate('postedBy', '_id username')
        .exec()
        
        res.status(200).json(post)
    } catch(error) {
        res.status(400).json({
            error: 'Server error'
        });
    };
};

exports.unlike = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.post._id, {
            $pull: { likes: req.profile._id }    // Pull likes from particular posts
        }, {
            new: true    //To get updated data
        })
        .populate('comments.postedBy', '_id username')
        .populate('postedBy', '_id username')
        .exec()

        res.status(200).json(post)
    } catch(error) {
        res.status(400).json({
            error: 'Server error'
        });
    };
};

exports.comment = async (req, res) => {
    try {
        const comment = {
            text: req.body.text,
            postedBy: req.profile._id
        }

        const post = await Post.findByIdAndUpdate(req.post._id, {
            $push: { comments: comment }    // Push COMMENTS into particular posts
        }, {
            new: true    //To get updated data
        })
        .populate('comments.postedBy')
        .populate('postedBy', '_id username')
        .exec();

        res.status(200).json({ comments: post.comments })
    } catch(error) {
        res.status(400).json({
            error: 'Server error'
        });
    };
};

exports.removeComment = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.post._id, {
            $pull: { 
                comments: {
                    _id: req.params.commentId
                }
            }    
        }, {
            new: true   
        })
        .sort({ createdAt: -1 })
        .populate('comments.postedBy')
        .populate('postedBy', '_id username')
        .exec();

        res.status(200).json({
            comments: post.comments,
            message: 'Comment deleted successfully!'
        });
    } catch(error) {
        res.status(400).json({
            error
        });
    };
};