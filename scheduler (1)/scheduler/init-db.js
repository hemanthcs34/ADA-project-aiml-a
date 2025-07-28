require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./models/Task");

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/smart-scheduler");
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Task.deleteMany({});
    console.log("🗑️  Cleared existing tasks");

    // Sample tasks data
    const sampleTasks = [
      {
        title: "Complete Project Presentation",
        description: "Prepare slides for the quarterly project review meeting",
        time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        priority: "high",
        type: "daily",
        category: "work",
        reminder: true,
        reminderTime: 15
      },
      {
        title: "Morning Exercise",
        description: "30 minutes cardio and strength training",
        time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        priority: "medium",
        type: "daily",
        category: "health",
        reminder: true,
        reminderTime: 10
      },
      {
        title: "Learn React Hooks",
        description: "Complete the advanced React course on Udemy",
        time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        priority: "medium",
        type: "weekly",
        category: "learning",
        reminder: true,
        reminderTime: 30
      },
      {
        title: "Grocery Shopping",
        description: "Buy ingredients for dinner and weekly supplies",
        time: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        priority: "low",
        type: "daily",
        category: "personal",
        reminder: true,
        reminderTime: 5
      },
      {
        title: "Team Meeting",
        description: "Weekly standup with the development team",
        time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        priority: "high",
        type: "weekly",
        category: "work",
        reminder: true,
        reminderTime: 15
      },
      {
        title: "Dentist Appointment",
        description: "Regular checkup and cleaning",
        time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        priority: "medium",
        type: "monthly",
        category: "health",
        reminder: true,
        reminderTime: 60
      },
      {
        title: "Budget Review",
        description: "Review monthly expenses and plan next month's budget",
        time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
        priority: "high",
        type: "monthly",
        category: "personal",
        reminder: true,
        reminderTime: 120
      }
    ];

    // Insert sample tasks
    await Task.insertMany(sampleTasks);
    console.log("📝 Inserted sample tasks");

    // Display created tasks
    const tasks = await Task.find({}).sort({ time: 1 });
    console.log("\n📋 Sample tasks created:");
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} (${task.priority} priority) - ${task.time.toLocaleString()}`);
    });

    console.log("\n🎉 Database initialization completed successfully!");
    console.log("🚀 You can now start the application with: npm start");

  } catch (error) {
    console.error("❌ Error initializing database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the initialization
initializeDatabase(); 