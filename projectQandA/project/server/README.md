# Student Q&A Platform Backend

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables
Create a `.env` file in the server directory with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-qa
JWT_SECRET=your_super_secret_jwt_key_here
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase Private Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### 3. MongoDB Setup
- Install MongoDB locally or use MongoDB Atlas
- Create a database named `student-qa`
- Update MONGODB_URI in .env file

### 4. Firebase Setup
- Create a Firebase project
- Enable Storage
- Generate a service account key
- Add the credentials to your .env file

### 5. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Questions
- `GET /api/questions` - Get all questions (with filtering)
- `POST /api/questions` - Create new question
- `POST /api/questions/:id/vote` - Vote on question

### Answers
- `GET /api/answers/question/:questionId` - Get answers for question
- `POST /api/answers` - Create new answer
- `POST /api/answers/:id/vote` - Vote on answer
- `POST /api/answers/:id/accept` - Accept answer

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/suggestions` - Get auto-suggestions

## Features

✅ **MongoDB Integration** - All data stored in MongoDB
✅ **File Upload** - Firebase Storage for attachments
✅ **Authentication** - JWT-based auth system
✅ **Voting System** - Upvote/downvote with duplicate prevention
✅ **Advanced Search** - Full-text search with MongoDB
✅ **Tag System** - Automatic tag counting and suggestions
✅ **File Security** - File type validation and size limits
✅ **Error Handling** - Comprehensive error handling
✅ **CORS Support** - Cross-origin requests enabled
✅ **Production Ready** - Environment-based configuration

## Database Schema

### Users Collection
- username, email, password (hashed)
- reputation, joinDate, avatar
- Unique indexes on username and email

### Questions Collection
- title, content, author (ref to User)
- tags array, vote counts, score
- attachments with Firebase URLs
- Text indexes for search

### Answers Collection
- questionId (ref), content, author (ref)
- vote counts, score, isAccepted
- Indexes on questionId and score

### Tags Collection
- name (unique), count, color
- Auto-updated when questions are created

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- File type validation
- File size limits (10MB)
- CORS configuration
- Input validation and sanitization