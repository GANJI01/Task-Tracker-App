// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import Authentication Middleware
const authMiddleware = require('../middleware/authMiddleware');

// Import Task Controller functions (to be created)
const {
  createTask,
  getProjectTasks,
  getTaskById, // Optional but good
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// --- Define Task Routes ---
// All routes below are prefixed with '/api/tasks' (defined in server.js)

// @route   POST /:projectId
// @desc    Create a new task for a specific project
// @access  Private
router.post(
  '/:projectId', // Task is created under a specific project
  [
    authMiddleware, // Must be logged in
    check('title', 'Task title is required').not().isEmpty().trim(),
    // Add other validations as needed (e.g., description length)
  ],
  createTask
);

// @route   GET /:projectId
// @desc    Get all tasks for a specific project
// @access  Private
router.get(
  '/:projectId',
  authMiddleware,
  getProjectTasks
);

// @route   GET /task/:taskId  (Using '/task/' prefix to avoid conflict with GET /:projectId)
// @desc    Get a single task by its ID
// @access  Private
router.get(
    '/task/:taskId',
    authMiddleware,
    getTaskById
);

// @route   PUT /:taskId
// @desc    Update a task
// @access  Private
router.put(
  '/:taskId', // Update by task ID
  [
    authMiddleware,
    // Add optional validation for fields being updated (e.g., title not empty if provided)
    check('title', 'Title cannot be empty if provided').optional().not().isEmpty().trim(),
    check('status', 'Invalid status').optional().isIn(['To Do', 'In Progress', 'Done']), // Validate status if provided
  ],
  updateTask
);

// @route   DELETE /:taskId
// @desc    Delete a task
// @access  Private
router.delete(
  '/:taskId',
  authMiddleware,
  deleteTask
);

module.exports = router;