const fs = require('fs');
const path = require('path');

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

exports.editPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validations failed!');
        error.statusCode = 422;
        throw error;
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        const filePathArray = req.file.path.split("\\");
        imageUrl = filePathArray.reduce((prev, curr, index) => {
            index === filePathArray.length - 1 ? prev += curr : prev += curr + '/';
            return prev;
        }, '');
    }
    if (!imageUrl) {
        const error = new Error('No file picked!');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found!');
                error.statusCode = 404;
                throw error;
            } else {
                if (imageUrl !== post.imageUrl) {
                    clearImage(post.imageUrl);
                }
                post.title = title;
                post.content = content;
                post.imageUrl = imageUrl;
                return post.save();
            }
        })
        .then(result => {
            res.status(200).json({
                message: 'Post updated successfully!',
                post: result
            });
        })
        .catch(error => next(error));
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found!');
                error.statusCode = 404;
                throw error;
            } else {
                clearImage(post.imageUrl);
                return Post.findByIdAndRemove(postId);
            }
        })
        .then(result => {
            res.status(200).json({
                message: 'Post deleted successfully!'
            });
        })
        .catch(error => next(error));
};

const clearImage = filePath => {
    console.log(path.join(__dirname, '..', filePath));
    fs.unlink(path.join(__dirname, '..', filePath), error => {
        if (error) next(error);
    });
};