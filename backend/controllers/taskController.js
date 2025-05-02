// backend/controllers/taskController.js

const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Helper function to check if a project exists and belongs to the user
const checkProjectAuthorization = async (projectId, userId) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return { error: true, status: 404, msg: 'Project not found' };
    }
    // toString() is important because user IDs are ObjectIds
    if (project.user.toString() !== userId.toString()) {
      return { error: true, status: 403, msg: 'User not authorized for this project' };
    }
    return { error: false, project }; // Return project if authorized
  } catch (err) {
      // Handle potential CastError if projectId is not a valid ObjectId format
     if (err.name === 'CastError' || err.kind === 'ObjectId') {
        return { error: true, status: 400, msg: 'Invalid Project ID format' };
    }
    console.error("Project Auth Helper Error:", err); // Log unexpected errors
    return { error: true, status: 500, msg: 'Server error checking project authorization' };
  }
};

// Helper function to check if a task exists and belongs to the user (via project)
const checkTaskAuthorization = async (taskId, userId) => {
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return { error: true, status: 404, msg: 'Task not found' };
        }
        // Check project authorization using the task's project ID
        const projectAuth = await checkProjectAuthorization(task.project, userId);
        if (projectAuth.error) {
            // Propagate project auth error (could be 404, 403, 400, or 500)
            return projectAuth;
        }
        return { error: false, task }; // Return task if authorized
    } catch (err) {
         // Handle potential CastError if taskId is not a valid ObjectId format
        if (err.name === 'CastError' || err.kind === 'ObjectId') {
            return { error: true, status: 400, msg: 'Invalid Task ID format' };
        }
        console.error("Task Auth Helper Error:", err); // Log unexpected errors
        return { error: true, status: 500, msg: 'Server error checking task authorization' };
    }
};

// ---- Create Task ----
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { projectId } = req.params;
  const userId = req.user.id;
  const { title, description } = req.body; // Removed status - use default

  try {
    // 1. Check if project exists and user is authorized
    const projectAuth = await checkProjectAuthorization(projectId, userId);
    if (projectAuth.error) {
      // Use status and msg from helper function's result
      return res.status(projectAuth.status).json({ errors: [{ msg: projectAuth.msg }] });
    }
    const project = projectAuth.project; // Get the authorized project object

    // 2. Create the new task
    const newTask = new Task({
      title,
      description: description || '',
      project: projectId,
      user: userId,
      // status uses default 'To Do' from model
      // dateOfCreation uses default Date.now from model
    });

    // 3. Save the task
    const task = await newTask.save();

    // 4. Add task reference to the project's tasks array (optional but good practice)
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json(task); // Return the newly created task

  } catch (err) {
    // Catch errors during task/project save
    console.error('Create Task Error:', err.message);
    res.status(500).send('Server error during task creation');
  }
};

// ---- Get Tasks for a Project ----
exports.getProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    // 1. Check if project exists and user is authorized
    const projectAuth = await checkProjectAuthorization(projectId, userId);
    if (projectAuth.error) {
      return res.status(projectAuth.status).json({ errors: [{ msg: projectAuth.msg }] });
    }

    // 2. Find tasks belonging to this project
    // Sort by creation date, oldest first (or however you prefer)
    const tasks = await Task.find({ project: projectId }).sort({ createdAt: 1 });

    res.json(tasks); // Return array of tasks (can be empty)

  } catch (err) {
    // Mongoose find errors are less common here if auth passed, but catch anyway
    console.error('Get Project Tasks Error:', err.message);
    res.status(500).send('Server error while retrieving tasks');
  }
};

// ---- Get Single Task By ID ----
exports.getTaskById = async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user.id;

    try {
        // 1. Check if task exists and user is authorized (via project)
        const taskAuth = await checkTaskAuthorization(taskId, userId);
        if (taskAuth.error) {
            return res.status(taskAuth.status).json({ errors: [{ msg: taskAuth.msg }] });
        }

        res.json(taskAuth.task); // Return the authorized task

    } catch (err) {
        // Errors should ideally be caught within checkTaskAuthorization helper
        console.error('Get Task By ID Controller Error:', err.message); // Log unexpected errors
        res.status(500).send('Server error while retrieving task');
    }
};

// ---- Update Task ----
exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { taskId } = req.params;
  const userId = req.user.id;
  const { title, description, status } = req.body;

  // Build task object based on fields provided in the request
  const taskFields = {};
  // Check undefined to allow setting field to empty string "" if desired
  if (title !== undefined) taskFields.title = title;
  if (description !== undefined) taskFields.description = description;
  if (status) taskFields.status = status;

  // Handle dateOfCompletion when status is 'Done' or changed from 'Done'
  if (status === 'Done') {
    taskFields.dateOfCompletion = Date.now();
  } else if (status && status !== 'Done') {
      // If status is explicitly being set to something other than 'Done', clear completion date
      taskFields.dateOfCompletion = null;
  }

  try {
    // 1. Check if task exists and user is authorized
    const taskAuth = await checkTaskAuthorization(taskId, userId);
    if (taskAuth.error) {
      return res.status(taskAuth.status).json({ errors: [{ msg: taskAuth.msg }] });
    }
    // We don't need the task object itself from taskAuth here, just confirmation

    // 2. Perform the update
    // Use { new: true } to return the modified document
    // Use { runValidators: true } to enforce schema validation (like enum for status) during update
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: taskFields }, // Use $set to update only provided fields
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
        // This case might occur if the task was deleted between the auth check and update
        // Or if findByIdAndUpdate fails unexpectedly. checkTaskAuthorization should prevent most not founds.
        return res.status(404).json({ errors: [{ msg: 'Task not found during update' }] });
    }

    res.json(updatedTask); // Return the updated task

  } catch (err) {
     // Handle potential validation errors from runValidators (e.g., invalid status enum)
     if (err.name === 'ValidationError') {
        return res.status(400).json({ errors: [{ msg: `Validation failed: ${err.message}` }] });
    }
    // Catch other errors during update
    console.error('Update Task Error:', err.message);
    res.status(500).send('Server error during task update');
  }
};

// ---- Delete Task ----
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  try {
    // 1. Check if task exists and user is authorized
    const taskAuth = await checkTaskAuthorization(taskId, userId);
    if (taskAuth.error) {
      return res.status(taskAuth.status).json({ errors: [{ msg: taskAuth.msg }] });
    }
    const task = taskAuth.task; // Get the authorized task object for its project ID

    // 2. Remove the task document itself
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
         // Should ideally be caught by checkTaskAuthorization, but as a safeguard
        return res.status(404).json({ errors: [{ msg: 'Task not found for deletion' }] });
    }

    // 3. Remove the task reference from the associated project's tasks array (optional but good practice)
    await Project.findByIdAndUpdate(
      task.project, // Get project ID from the task we are deleting
      { $pull: { tasks: taskId } }, // Use $pull to remove the taskId from the array
      { new: true } // Options aren't strictly necessary for $pull but doesn't hurt
    );
    // Note: Error handling for the project update could be added, but often it's acceptable
    // if the task is deleted even if the $pull fails in rare cases.

    res.json({ msg: 'Task removed successfully' }); // Send success confirmation

  } catch (err) {
    // Catch errors during delete or project update
    console.error('Delete Task Error:', err.message);
    res.status(500).send('Server error during task deletion');
  }
};