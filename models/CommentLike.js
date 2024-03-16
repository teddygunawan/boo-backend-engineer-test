const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentLikeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment', // Reference to the Comment model
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const CommentLike =
  mongoose.models.CommentLike ||
  mongoose.model('CommentLike', CommentLikeSchema);

module.exports = CommentLike;
