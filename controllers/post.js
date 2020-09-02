const Post = require('../models/post');

exports.postById = async(req ,res, next, id) => {
    try{
        const post = await Post.findById(id).exec();
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
        const { body, pic } = req.body;
        const post = new Post({ body, pic, postedBy: req.profile });
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
        const posts = await Post.find({}).sort({ createdAt: -1 });
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
        const post = await Post.findById(req.post._id);
        if(!post) {
            throw new Error();
        }
    
        // Check if the post has not yet been liked
        if (post.likes.some(like => like.user.toString() === req.profile._id)) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.profile._id });
        await post.save();

        return res.status(200).json(post.likes);
    } catch(error) {
        res.status(400).json({
            error: 'Posts not found'
        });
    };
};