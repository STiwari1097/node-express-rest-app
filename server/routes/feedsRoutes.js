const express = require('express');

const feedsController = require('../controllers/feedsController');

const feedsRouter = express.Router();

feedsRouter.get('/posts', feedsController.fetchPosts);
feedsRouter.post('/post', feedsController.createPost);

module.exports = feedsRouter;