const express = require('express');
const Tag = require('../models/Tag');
const Question = require('../models/Question');

const router = express.Router();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ count: -1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get auto-suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json([]);
    }

    // Search in question titles, content, and tags
    const suggestions = await Question.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          words: {
            $concatArrays: [
              { $split: ["$title", " "] },
              { $split: ["$content", " "] },
              "$tags"
            ]
          }
        }
      },
      { $unwind: "$words" },
      {
        $match: {
          words: { $regex: query, $options: 'i' }
        }
      },
      {
        $group: {
          _id: { $toLower: "$words" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const suggestionList = suggestions.map(s => s._id);
    res.json(suggestionList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;