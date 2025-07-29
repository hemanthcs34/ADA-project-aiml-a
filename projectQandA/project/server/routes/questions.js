const express = require('express');
const multer = require('multer');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Tag = require('../models/Tag');
const auth = require('../middleware/auth');
const { initializeFirebase } = require('../config/firebase');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all questions with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      tags,
      search,
      sortBy = 'score'
    } = req.query;

    let query = {};

    // Tag filtering
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      default:
        sort = { score: -1, createdAt: -1 };
    }

    const questions = await Question.find(query)
      .populate('author', 'username avatar reputation')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get answer counts for each question
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({ questionId: question._id });
        const answers = await Answer.find({ questionId: question._id })
          .populate('author', 'username avatar reputation')
          .sort({ score: -1, createdAt: -1 });
        
        return {
          ...question,
          answers,
          answerCount
        };
      })
    );

    const total = await Question.countDocuments(query);

    res.json({
      questions: questionsWithAnswers,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new question
router.post('/', upload.array('attachments'), async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Parse tags
    const tagArray = JSON.parse(tags || '[]').map(tag => tag.toLowerCase().trim());

    // Create question (no attachments, no author)
    const question = new Question({
      title,
      content,
      tags: tagArray,
      attachments: []
    });

    await question.save();

    // Update tag counts
    await updateTagCounts(tagArray);

    // Populate author info (skip if no author)
    // await question.populate('author', 'username avatar reputation');

    res.status(201).json(question);
  } catch (error) {
    console.error('Error in POST /api/questions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vote on question
router.post('/:id/vote', async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Simple upvote/downvote logic for anonymous users
    if (voteType === 'up') {
      question.upvotes += 1;
    } else if (voteType === 'down') {
      question.downvotes += 1;
    }
    question.score = question.upvotes - question.downvotes;
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to update tag counts
async function updateTagCounts(tags) {
  for (const tagName of tags) {
    await Tag.findOneAndUpdate(
      { name: tagName },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  }
}

module.exports = router;