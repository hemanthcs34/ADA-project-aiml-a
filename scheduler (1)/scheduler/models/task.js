const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Task title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  // For backward compatibility
  time: { 
    type: Date,
    default: Date.now
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "medium" 
  },
  type: { 
    type: String, 
    enum: ["daily", "weekly", "monthly"], 
    required: [true, "Task type is required"]
  },
  done: { 
    type: Boolean, 
    default: false 
  },
  category: {
    type: String,
    enum: ["work", "personal", "health", "learning", "other"],
    default: "other"
  },
  reminder: {
    type: Boolean,
    default: true
  },
  reminderTime: {
    type: Number, // minutes before endTime
    default: 5
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

taskSchema.index({ type: 1, startTime: 1 });
taskSchema.index({ done: 1 });

taskSchema.virtual('formattedStartTime').get(function() {
  return this.startTime ? this.startTime.toLocaleString() : '';
});
taskSchema.virtual('formattedEndTime').get(function() {
  return this.endTime ? this.endTime.toLocaleString() : '';
});

taskSchema.methods.isOverdue = function() {
  const endTime = this.endTime || this.time;
  return !this.done && endTime < new Date();
};

taskSchema.methods.getTimeUntilEnd = function() {
  const now = new Date();
  const endTime = this.endTime || this.time;
  const diff = endTime - now;
  return diff;
};

module.exports = mongoose.model("Task", taskSchema);
