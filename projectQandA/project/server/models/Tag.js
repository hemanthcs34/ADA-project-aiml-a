const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  count: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#3b82f6'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tag', tagSchema);