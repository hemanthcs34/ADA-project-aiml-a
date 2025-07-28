# 🧠 Smart Scheduler - Complete Full-Stack Task Management

A modern, responsive task scheduling application built with Node.js, Express, MongoDB, and vanilla JavaScript. Features a beautiful UI with real-time notifications and comprehensive task management capabilities.

## ✨ Features

### 🎯 Core Functionality
- **Task Management**: Create, edit, delete, and toggle task completion status
- **Multiple Views**: Daily, weekly, and monthly task organization
- **Priority Levels**: Low, medium, and high priority tasks with visual indicators
- **Categories**: Organize tasks by work, personal, health, learning, or other
- **Smart Notifications**: Browser notifications for upcoming tasks
- **Real-time Updates**: Auto-refresh and live status updates

### 🎨 User Interface
- **Modern Design**: Beautiful gradient background and card-based layout
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Status Indicators**: Visual badges for task status (pending, completed, overdue)
- **Modal Dialogs**: Clean edit interface for task modifications

### 🔧 Technical Features
- **RESTful API**: Complete CRUD operations for tasks
- **Database Integration**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error handling and user feedback
- **CORS Support**: Cross-origin resource sharing enabled
- **Environment Configuration**: Flexible configuration with environment variables

## 🧮 Main Practical Algorithms Used

This project uses several core algorithms to power its main features:

- **Linear Search**
  - **Where:**
    - Search bar (frontend): Finds tasks by title or description as you type.
    - Filtering (frontend): Shows only tasks that match the selected type or category.
    - Duplicate detection (frontend): Checks for existing tasks with the same title and start time.
  - **How:**
    - Iterates through all tasks to find matches for the search query, filter, or duplicate check.

- **Binary Search**
  - **Where:**
    - Exact title search (frontend, sorted list): Used for efficient lookup of a task by exact title.
  - **How:**
    - Searches a sorted array of tasks by repeatedly dividing the search interval in half.

- **TimSort (JavaScript Array Sort)**
  - **Where:**
    - Sorting tasks by due date (frontend): Orders tasks by end time before display.
  - **How:**
    - Uses JavaScript’s built-in `Array.prototype.sort()` method, which implements TimSort for efficient and stable sorting.

- **MongoDB Sort**
  - **Where:**
    - Sorting tasks by due date (backend): Orders tasks by end time before sending to the frontend.
  - **How:**
    - Uses MongoDB’s optimized sort algorithm in database queries.

- **Rule-based Validation**
  - **Where:**
    - Add/Edit task (frontend and backend): Ensures all required fields are present and valid.
  - **How:**
    - Checks that fields like title, start time, and end time are filled, and that start time is before end time.

- **Timer Scheduling**
  - **Where:**
    - Notifications and alarms (frontend): Schedules reminders for when a task’s end time is reached.
  - **How:**
    - Uses JavaScript’s `setTimeout` to trigger notifications and alarms at the correct time.

- **Debounce**
  - **Where:**
    - Search input (frontend): Prevents the search function from running too often as the user types.
  - **How:**
    - Delays the execution of the search function until the user stops typing for a short period.

- **Min-Heap (Priority Queue)**
  - **Where:**
    - Advanced alarm scheduling (frontend, future use): Efficiently manages multiple scheduled alarms.
  - **How:**
    - Ensures the soonest alarm is always triggered first by maintaining a min-heap of tasks by end time.

**These practical algorithms make your Smart Scheduler app fast, interactive, and user-friendly!**

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd smart-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/smart-scheduler
   PORT=3000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - **Local MongoDB**: Start your MongoDB service
   - **MongoDB Atlas**: Use your connection string in the `.env` file

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
smart-scheduler/
├── models/
│   └── task.js              # MongoDB Task model
├── public/
│   ├── css/
│   │   └── style.css        # Modern responsive styles
│   ├── js/
│   │   └── app.js           # Frontend JavaScript
│   └── index.html           # Main HTML file
├── server.js                # Express server and API routes
├── package.json             # Dependencies and scripts
├── env.example              # Environment variables template
└── README.md                # This file
```

## 🔌 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (with optional query parameters)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion status

### Health Check
- `GET /api/health` - Server health status

### Query Parameters
- `view`: Filter by task type (daily, weekly, monthly)
- `category`: Filter by task category

## 🎯 Usage Guide

### Creating Tasks
1. Fill in the task title (required)
2. Add an optional description
3. Set the date and time
4. Choose priority level (low, medium, high)
5. Select a category
6. Enable/disable reminders
7. Click "Add Task"

### Managing Tasks
- **Complete Task**: Click the checkmark icon
- **Edit Task**: Click the edit icon to open the modal
- **Delete Task**: Click the trash icon (with confirmation)
- **Filter Tasks**: Use the view and category dropdowns

### Notifications
- The app will request notification permission on first load
- Notifications appear 5 minutes before scheduled tasks
- Browser notifications work even when the app is minimized

## 🛠️ Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (placeholder)
```

### Adding New Features
1. **Backend**: Add new routes in `server.js`
2. **Frontend**: Extend functionality in `public/js/app.js`
3. **Styling**: Modify `public/css/style.css`
4. **Database**: Update the Task model in `models/task.js`

### Environment Variables
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## 🔧 Configuration

### MongoDB Setup
- **Local**: Install MongoDB and start the service
- **Atlas**: Create a free cluster and use the connection string
- **Connection String Format**: `mongodb://username:password@host:port/database`

### Customization
- **Colors**: Modify CSS variables in `style.css`
- **Categories**: Update the category enum in the Task model
- **Priority Levels**: Modify priority options in the model and UI
- **Notification Timing**: Adjust reminder time in the JavaScript

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Port Already in Use**
   - Change the PORT in `.env`
   - Kill existing processes on the port

3. **Notifications Not Working**
   - Check browser notification permissions
   - Ensure HTTPS in production (required for notifications)

4. **Tasks Not Loading**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check MongoDB connection

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## 📱 Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License.

## 🙏 Acknowledgments
- Font Awesome for icons
- MongoDB for the database
- Express.js for the web framework
- Modern CSS for styling inspiration

## NAME AND USN
NAME:L K Tejaswini
USN:4NI23CI050

## GUIDED BY
Mahe Mubeen Akhthar mam

**Happy Task Scheduling! 🎉** 