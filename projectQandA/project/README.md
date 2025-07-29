# Student Q&A Platform - Full Stack Application

A comprehensive student Q&A platform built with React, Node.js, MongoDB, and Firebase, featuring advanced algorithms for sorting, filtering, and auto-suggestions.

## 🚀 Features

### Core Functionality
- ✅ **Question & Answer System** - Students can post questions and provide answers
- ✅ **File Upload Support** - Upload important notes and attachments via Firebase Storage
- ✅ **User Authentication** - Secure JWT-based authentication system
- ✅ **Voting System** - Upvote/downvote questions and answers with duplicate prevention

### Advanced Algorithms
- ✅ **Heap-based Sorting** - Efficient question sorting by score using Max Heap
- ✅ **HashMap Filtering** - Fast tag-based filtering using custom HashMap implementation
- ✅ **Trie Auto-suggestions** - Intelligent search suggestions using Trie data structure
- ✅ **Full-text Search** - MongoDB text search across questions, content, and tags

### Technical Features
- ✅ **MongoDB Database** - Persistent data storage with proper indexing
- ✅ **Firebase Storage** - Secure file upload and storage
- ✅ **RESTful API** - Complete backend API with Express.js
- ✅ **Responsive Design** - Mobile-first design with Tailwind CSS
- ✅ **Real-time Updates** - Dynamic content updates
- ✅ **Error Handling** - Comprehensive error handling and validation

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Storage & Deployment
- **Firebase Storage** for file uploads
- **MongoDB Atlas** (production) / Local MongoDB (development)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Firebase project with Storage enabled

### 1. Clone and Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-qa
JWT_SECRET=your_super_secret_jwt_key_here
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase Private Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### 3. Database Setup
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas connection string in .env
```

### 4. Firebase Setup
1. Create a Firebase project
2. Enable Storage
3. Generate service account key
4. Add credentials to `.env` file

### 5. Start the Application
```bash
# Start both frontend and backend
npm run start:full

# Or start separately:
# Backend only
npm run server

# Frontend only
npm run dev
```

## 🏗 Project Structure

```
├── src/                          # Frontend React application
│   ├── components/              # React components
│   ├── hooks/                   # Custom React hooks
│   ├── services/               # API service layer
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions and algorithms
├── server/                      # Backend Node.js application
│   ├── models/                 # MongoDB models
│   ├── routes/                 # API routes
│   ├── middleware/             # Express middleware
│   ├── config/                 # Configuration files
│   └── server.js              # Main server file
└── docs/                       # Documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Questions
- `GET /api/questions` - Get questions (with filtering/sorting)
- `POST /api/questions` - Create new question
- `POST /api/questions/:id/vote` - Vote on question

### Answers
- `GET /api/answers/question/:questionId` - Get answers for question
- `POST /api/answers` - Create new answer
- `POST /api/answers/:id/vote` - Vote on answer
- `POST /api/answers/:id/accept` - Accept answer

### Tags & Search
- `GET /api/tags` - Get all tags
- `GET /api/tags/suggestions` - Get auto-suggestions

## 🧮 Algorithm Implementations

### 1. Max Heap for Question Sorting
```typescript
// Efficient O(log n) insertion and O(log n) extraction
class MaxHeap<T> {
  // Implementation in src/utils/dataStructures.ts
}
```

### 2. HashMap for Tag Filtering
```typescript
// O(1) average case lookup and insertion
class HashMap<K, V> {
  // Implementation in src/utils/dataStructures.ts
}
```

### 3. Trie for Auto-suggestions
```typescript
// O(m) search where m is the length of the search term
class Trie {
  // Implementation in src/utils/dataStructures.ts
}
```

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **File Validation** - Type and size restrictions
- **CORS Configuration** - Proper cross-origin setup
- **Input Sanitization** - MongoDB injection prevention

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Connect MongoDB Atlas
3. Configure Firebase credentials
4. Deploy with `git push`

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure API base URL for production

## 📱 Usage

1. **Register/Login** - Create an account or login
2. **Ask Questions** - Click "Ask Question" to post new questions
3. **Answer Questions** - Click on question titles to view and answer
4. **Vote** - Upvote/downvote helpful content
5. **Search & Filter** - Use tags and search to find relevant content
6. **Upload Files** - Attach important notes and documents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in `/docs`
- Review the API documentation in server README