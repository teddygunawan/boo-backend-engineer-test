const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    mbti: {
      type: String,
    },
    enneagram: {
      type: String,
    },
    variant: {
      type: String,
    },
    tritype: {
      type: Number,
    },
    socionics: {
      type: String,
    },
    sloan: {
      type: String,
    },
    psyche: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
