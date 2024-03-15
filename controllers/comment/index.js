const CommentLike = require('@/models/CommentLike');
const Comment = require('@/models/Comment');
const { ObjectId } = require('mongoose').Types;

module.exports = {
  async create(req, res) {
    try {
      const newComment = new Comment(req.body);
      const savedComment = await newComment.save();

      return res.status(201).json(savedComment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async findByUserId(req, res) {
    try {
      const { userId } = req.params;
      const { sortBy, filterBy } = req.query;

      const { mbti, enneagram, zodiac } = filterBy || {};
      const filters = {
        ...(mbti && { 'personality.mbti': mbti }),
        ...(enneagram && { 'personality.enneagram': enneagram }),
        ...(zodiac && { 'personality.zodiac': zodiac }),
      };

      const sortObj =
        sortBy === 'best' ? { totalLikes: -1 } : { createdAt: -1 };

      const commentList = await Comment.aggregate([
        {
          $match: {
            user_id: new ObjectId(userId),
            ...filters,
          },
        },
        {
          $lookup: {
            from: 'commentlikes',
            localField: '_id',
            foreignField: 'commentId',
            as: 'likedBy',
          },
        },
        {
          $addFields: {
            totalLikes: { $size: '$likedBy' },
          },
        },
        {
          $sort: sortObj,
        },
      ]);

      if (commentList.length === 0) {
        return res
          .status(404)
          .json({ error: 'No comments found for the user' });
      }

      return res.json(commentList);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async likeComment(req, res) {
    try {
      const comment = await Comment.findById(req.params.commentId);
      const commentId = comment.id;
      const userId = req.body.userId;

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      const deletedLike = await CommentLike.findOneAndDelete({
        userId,
        commentId,
      });

      if (deletedLike) {
        return res.json({
          commentLike: deletedLike,
          message: 'Comment disliked successfully',
        });
      }

      const newLike = new CommentLike({
        userId: req.body.userId,
        commentId: comment.id,
      });
      await newLike.save();

      return res.json({ commentLike: newLike, message: 'Comment liked successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
