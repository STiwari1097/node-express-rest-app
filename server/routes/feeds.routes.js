const express = require('express');

const { body } = require('express-validator');

const feedsController = require('../controllers/feeds.controller');

const feedsRouter = express.Router();

feedsRouter.get('/posts', feedsController.fetchPosts);

feedsRouter.post('/post', [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
], feedsController.createPost);

feedsRouter.get('/post/:postId', feedsController.fetchSinglePost);

module.exports = feedsRouter;