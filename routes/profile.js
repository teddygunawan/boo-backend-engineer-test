const express = require('express');
const UserController = require('@/controllers/user');
const CommentController = require('@/controllers/comment');

const router = express.Router();

module.exports = () => {
  // Comment Routes
  router.get('/users/:userId/comments', CommentController.findByUserId);
  router.post('/users/:userId/comments', CommentController.create);
  router.post('/users/:userId/:commentId/like', CommentController.likeComment);

  // User Routes
  router.get('/users/:userId', UserController.findById);
  router.post('/users', UserController.create);
  router.get('/users', UserController.get);
  return router;
};
