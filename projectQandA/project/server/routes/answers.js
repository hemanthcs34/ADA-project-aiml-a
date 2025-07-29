console.log("answers.js route loaded");
const express = require('express');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

// Get answers for a question
router.get('/question/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId })
      .populate('author', 'username avatar reputation')
      .sort({ score: -1, createdAt: -1 });

    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new answer
router.post('/', async (req, res) => {
  // Log headers and body for debugging
  console.log("POST /api/answers headers:", req.headers);
  console.log("POST /api/answers body:", req.body);

  // Check Content-Type
  if (!req.is('application/json')) {
    return res.status(400).json({ error: 'Content-Type must be application/json' });
  }
  const { questionId, content } = req.body;
  if (!questionId || typeof questionId !== 'string' || !content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Invalid questionId or content' });
  }
  try {
    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answer = new Answer({
      questionId,
      content: content.trim(),
      upvotes: 0,
      downvotes: 0,
      score: 0
    });

    await answer.save();
    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vote on answer
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Check if user already voted
    const existingVote = answer.votedBy.find(
      vote => vote.user.toString() === req.user._id.toString()
    );

    if (existingVote) {
      // Remove existing vote
      if (existingVote.voteType === 'up') {
        answer.upvotes -= 1;
      } else {
        answer.downvotes -= 1;
      }
      answer.votedBy = answer.votedBy.filter(
        vote => vote.user.toString() !== req.user._id.toString()
      );
    }

    // Add new vote if different or first time
    if (!existingVote || existingVote.voteType !== voteType) {
      if (voteType === 'up') {
        answer.upvotes += 1;
      } else {
        answer.downvotes += 1;
      }
      answer.votedBy.push({
        user: req.user._id,
        voteType
      });
    }

    answer.score = answer.upvotes - answer.downvotes;
    await answer.save();

    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept answer
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    const question = await Question.findById(answer.questionId);
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only question author can accept answers' });
    }

    // Unaccept all other answers for this question
    await Answer.updateMany(
      { questionId: answer.questionId },
      { isAccepted: false }
    );

    // Accept this answer
    answer.isAccepted = true;
    await answer.save();

    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
  res.json({ message: "GET /api/answers is working!" });
});

module.exports = router;