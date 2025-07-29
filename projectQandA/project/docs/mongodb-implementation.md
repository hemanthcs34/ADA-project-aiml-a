# MongoDB Integration for Student Q&A Platform

## Current Implementation
The current app uses **localStorage** for data persistence, which means:
- Data is stored in the browser
- Data persists between sessions on the same device
- No server-side database required
- Suitable for demo/development purposes

## Production MongoDB Implementation

### 1. Database Schema Design

```javascript
// MongoDB Collections

// Users Collection
{
  _id: ObjectId,
  username: String,
  email: String,
  avatar: String,
  reputation: Number,
  joinDate: Date,
  createdAt: Date,
  updatedAt: Date
}

// Questions Collection
{
  _id: ObjectId,
  title: String,
  content: String,
  authorId: ObjectId, // Reference to Users
  tags: [String],
  upvotes: Number,
  downvotes: Number,
  score: Number,
  attachments: [{
    filename: String,
    firebaseUrl: String,
    fileType: String,
    uploadDate: Date
  }],
  createdAt: Date,
  updatedAt: Date
}

// Answers Collection
{
  _id: ObjectId,
  questionId: ObjectId, // Reference to Questions
  content: String,
  authorId: ObjectId, // Reference to Users
  upvotes: Number,
  downvotes: Number,
  score: Number,
  isAccepted: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Tags Collection
{
  _id: ObjectId,
  name: String,
  count: Number,
  color: String,
  createdAt: Date
}
```

### 2. Backend API Implementation (Node.js + Express)

```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/student-qa', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Models
const User = require('./models/User');
const Question = require('./models/Question');
const Answer = require('./models/Answer');
const Tag = require('./models/Tag');

// Firebase Admin Setup
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: 'your-project.appspot.com'
});

const bucket = admin.storage().bucket();

// File Upload Configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes

// Get all questions with pagination and filtering
app.get('/api/questions', async (req, res) => {
  try {
    const { page = 1, limit = 10, tags, search, sortBy = 'score' } = req.query;
    
    let query = {};
    
    // Tag filtering
    if (tags) {
      query.tags = { $in: tags.split(',') };
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
        sort = { score: -1 };
    }
    
    const questions = await Question.find(query)
      .populate('authorId', 'username avatar reputation')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Question.countDocuments(query);
    
    res.json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new question
app.post('/api/questions', upload.array('attachments'), async (req, res) => {
  try {
    const { title, content, tags, authorId } = req.body;
    
    // Handle file uploads to Firebase
    const attachments = [];
    if (req.files) {
      for (const file of req.files) {
        const fileName = `${Date.now()}_${file.originalname}`;
        const fileUpload = bucket.file(fileName);
        
        await fileUpload.save(file.buffer, {
          metadata: {
            contentType: file.mimetype
          }
        });
        
        const [url] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-01-2500'
        });
        
        attachments.push({
          filename: file.originalname,
          firebaseUrl: url,
          fileType: file.mimetype,
          uploadDate: new Date()
        });
      }
    }
    
    const question = new Question({
      title,
      content,
      authorId,
      tags: JSON.parse(tags),
      attachments,
      upvotes: 0,
      downvotes: 0,
      score: 0
    });
    
    await question.save();
    
    // Update tag counts
    await updateTagCounts(JSON.parse(tags));
    
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get answers for a question
app.get('/api/questions/:questionId/answers', async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId })
      .populate('authorId', 'username avatar reputation')
      .sort({ score: -1, createdAt: -1 });
    
    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new answer
app.post('/api/questions/:questionId/answers', async (req, res) => {
  try {
    const { content, authorId } = req.body;
    
    const answer = new Answer({
      questionId: req.params.questionId,
      content,
      authorId,
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

// Vote on question
app.post('/api/questions/:questionId/vote', async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.questionId);
    
    if (voteType === 'up') {
      question.upvotes += 1;
    } else {
      question.downvotes += 1;
    }
    
    question.score = question.upvotes - question.downvotes;
    await question.save();
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vote on answer
app.post('/api/answers/:answerId/vote', async (req, res) => {
  try {
    const { voteType } = req.body;
    const answer = await Answer.findById(req.params.answerId);
    
    if (voteType === 'up') {
      answer.upvotes += 1;
    } else {
      answer.downvotes += 1;
    }
    
    answer.score = answer.upvotes - answer.downvotes;
    await answer.save();
    
    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get auto-suggestions
app.get('/api/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    
    // Search in questions and tags
    const suggestions = await Question.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          suggestions: {
            $concatArrays: [
              { $split: ["$title", " "] },
              "$tags"
            ]
          }
        }
      },
      { $unwind: "$suggestions" },
      {
        $match: {
          suggestions: { $regex: query, $options: 'i' }
        }
      },
      { $group: { _id: "$suggestions" } },
      { $limit: 10 }
    ]);
    
    res.json(suggestions.map(s => s._id));
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

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

### 3. Mongoose Models

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar: String,
  reputation: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  attachments: [{
    filename: String,
    firebaseUrl: String,
    fileType: String,
    uploadDate: Date
  }]
}, { timestamps: true });

// Index for better search performance
questionSchema.index({ title: 'text', content: 'text', tags: 'text' });
questionSchema.index({ score: -1 });
questionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Question', questionSchema);

// models/Answer.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  isAccepted: { type: Boolean, default: false }
}, { timestamps: true });

answerSchema.index({ questionId: 1, score: -1 });

module.exports = mongoose.model('Answer', answerSchema);

// models/Tag.js
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  color: String
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);
```

### 4. Frontend API Integration

```javascript
// services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  static async getQuestions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/questions?${queryString}`);
    return response.json();
  }

  static async createQuestion(questionData, files) {
    const formData = new FormData();
    formData.append('title', questionData.title);
    formData.append('content', questionData.content);
    formData.append('tags', JSON.stringify(questionData.tags));
    formData.append('authorId', questionData.authorId);
    
    if (files) {
      files.forEach(file => {
        formData.append('attachments', file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  static async getAnswers(questionId) {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers`);
    return response.json();
  }

  static async createAnswer(questionId, answerData) {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answerData)
    });
    return response.json();
  }

  static async voteQuestion(questionId, voteType) {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voteType })
    });
    return response.json();
  }

  static async getSuggestions(query) {
    const response = await fetch(`${API_BASE_URL}/suggestions?query=${query}`);
    return response.json();
  }
}

export default ApiService;
```

### 5. Firebase Storage Integration

```javascript
// services/fileUpload.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadFile = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `uploads/${fileName}`);
  
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return {
    filename: file.name,
    url: downloadURL,
    type: file.type,
    size: file.size
  };
};
```

## Migration Steps

To migrate from localStorage to MongoDB:

1. **Set up MongoDB database**
2. **Create Node.js backend with the above API endpoints**
3. **Set up Firebase Storage for file uploads**
4. **Replace localStorage calls with API calls in the frontend**
5. **Add proper error handling and loading states**
6. **Implement user authentication (JWT tokens)**
7. **Add data validation and security measures**

## Benefits of MongoDB Implementation

- **Persistent data** across devices and sessions
- **Scalable** for multiple users
- **Real-time updates** possible with WebSockets
- **Advanced querying** capabilities
- **File storage** with Firebase integration
- **Data backup** and recovery options
- **Performance optimization** with indexing