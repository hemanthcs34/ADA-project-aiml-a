require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./models/Task");

const app = express();

// Middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/smart-scheduler")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// API Routes
app.get("/api/tasks", async (req, res) => {
  try {
    const type = req.query.view || "daily";
    const tasks = await Task.find({ type }).sort({ time: 1 });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, startTime, endTime, time, priority, type, category, reminder, reminderTime } = req.body;
    
    if (!title || !type) {
      return res.status(400).json({ error: "Title and type are required" });
    }

    // For backward compatibility, use time if startTime/endTime not provided
    const taskData = {
      title, 
      description, 
      priority, 
      type, 
      category, 
      reminder, 
      reminderTime
    };

    if (startTime && endTime) {
      taskData.startTime = startTime;
      taskData.endTime = endTime;
      taskData.time = endTime; // Set time to endTime for compatibility
    } else if (time) {
      taskData.time = time;
      taskData.startTime = time;
      taskData.endTime = time;
    } else {
      return res.status(400).json({ error: "Either startTime/endTime or time is required" });
    }

    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: "Failed to create task" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startTime, endTime, priority, type, category, reminder, reminderTime, done } = req.body;
    const update = {
      title, description, startTime, endTime, time: endTime, priority, type, category, reminder, reminderTime, done
    };
    const task = await Task.findByIdAndUpdate(
      id, 
      update,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(400).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(400).json({ error: "Failed to delete task" });
  }
});

app.patch("/api/tasks/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    task.done = !task.done;
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error("Error toggling task:", error);
    res.status(400).json({ error: "Failed to toggle task" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  
});
