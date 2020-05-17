const { validationResult } = require('express-validator');

const Post = require('../models/post.model');

exports.fetchPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            if (!posts) {
                const error = new Error('No post found!');
                error.statusCode = 404;
                throw error;
            } else {
                res.status(200).json({
                    posts: posts,
                    totalItems: posts.length
                });
            }
        })
        .catch(error => next(error));
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validations failed!');
        error.statusCode = 422;
        throw error;
    }

    if (!req.file) {
        const error = new Error('Image is missing!');
        error.statusCode = 422;
        throw error;
    }

    const filePathArray = req.file.path.split("\\");
    const filePath = filePathArray.reduce((prev, curr, index) => {
        index === filePathArray.length - 1 ? prev += curr : prev += curr + '/';
        return prev;
    }, '');
    const post = new Post({
        title: req.body.title,
        imageUrl: filePath,
        content: req.body.content,
        creator: { name: 'John Doe' }
    });

    post.save().then(result => {
        res.status(201).json({
            message: 'Post created successfully!',
            post: result
        });
    }).catch(error => next(error));
};

exports.fetchSinglePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found!');
                error.statusCode = 404;
                throw error;
            } else {
                res.status(200).json({
                    post: post
                });
            }
        })
        .catch(error => next(error));
};