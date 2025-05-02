// backend/models/Task.js

const mongoose = require('mongoose');

// Define the schema for the Task model
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
      maxlength: [200, 'Task title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      // Not required by default, but you could add 'required: true' if needed
    },
    status: {
      type: String,
      required: true,
      enum: ['To Do', 'In Progress', 'Done'], // Restrict status to these values
      default: 'To Do',                     // Default status when a task is created
    },
    project: {
      // Link to the Project this task belongs to
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    user: {
      // Link to the User who owns this task (often same as project owner, but good for reference)
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dateOfCreation: {
      // Explicitly defined as requested, though timestamps provide createdAt
      type: Date,
      default: Date.now,
    },
    dateOfCompletion: {
      // Will be set when status changes to 'Done'
      type: Date,
      // No default value needed here
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    // Note: 'createdAt' will be very similar to 'dateOfCreation' here due to the default
    timestamps: true,
  }
);

// Export the model. Mongoose will create a collection named 'tasks'.
module.exports = mongoose.model('Task', TaskSchema);