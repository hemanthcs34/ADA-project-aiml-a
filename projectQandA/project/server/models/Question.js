const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  attachments: [{
    id: String,
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  votedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    voteType: {
      type: String,
      enum: ['up', 'down']
    }
  }]
}, {
  timestamps: true
});

// Indexes for better performance
questionSchema.index({ title: 'text', content: 'text', tags: 'text' });
questionSchema.index({ score: -1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ tags: 1 });

module.exports = mongoose.model('Question', questionSchema);