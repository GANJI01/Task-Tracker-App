// backend/models/Project.js

const mongoose = require('mongoose');

// Define the schema for the Project model
const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a project name'],
      trim: true,
      maxlength: [100, 'Project name cannot be more than 100 characters'], // Example validation
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'On Hold', 'Completed'],
      default: 'Not Started',
    },
    user: {
      // Define a relationship to the User model
      type: mongoose.Schema.Types.ObjectId, // Stores the User's unique _id
      ref: 'User',                          // Specifies that this ID refers to a document in the 'User' collection
      required: true,                       // Each project must belong to a user
    },
    teamMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    tasks: [
      // Define an array to hold references to Task documents
      {
        type: mongoose.Schema.Types.ObjectId, // Each element in the array is a Task's _id
        ref: 'Task',                          // Specifies that these IDs refer to documents in the 'Task' collection
      },
    ],
    // You could add other fields like 'dueDate' etc. if needed
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Export the model. Mongoose will create a collection named 'projects'.
module.exports = mongoose.model('Project', ProjectSchema);