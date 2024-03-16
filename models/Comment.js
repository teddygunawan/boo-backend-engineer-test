const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define schema
const CommentSchema = Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commenter_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
    },
    personality: {
      mbti: {
        type: String,
        enum: {
          message: '{VALUE} is not a valid value',
          values: [
            'INFP',
            'INFJ',
            'ENFP',
            'ENFJ',
            'INTJ',
            'INTP',
            'ENTP',
            'ENTJ',
            'ISFP',
            'ISFJ',
            'ESFP',
            'ESFJ',
            'ISTP',
            'ISTJ',
            'ESTP',
            'ESTJ',
          ],
        },
      },
      enneagram: {
        type: String,
        enum: {
          message: '{VALUE} is not a valid value',
          values: [
            '1w2',
            '2w3',
            '3w2',
            '3w4',
            '4w3',
            '4w5',
            '5w4',
            '5w6',
            '6w5',
            '6w7',
            '7w6',
            '7w8',
            '8w7',
            '8w9',
            '9w8',
            '9w1',
          ],
        },
      },
      zodiac: {
        type: String,
        enum: {
          message: '{VALUE} is not a valid value',
          values: [
            'Aries',
            'Taurus',
            'Gemini',
            'Cancer',
            'Leo',
            'Virgo',
            'Libra',
            'Scorpio',
            'Sagittarius',
            'Capricorn',
            'Aquarius',
            'Pisces',
          ],
        },
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CommentSchema.virtual('likedBy', {
  ref: 'CommentLike',
  localField: '_id',
  foreignField: 'commentId',
});

const Comment =
  mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

module.exports = Comment;
