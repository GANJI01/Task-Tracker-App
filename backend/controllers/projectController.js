// backend/controllers/projectController.js

// ... (Keep the require statements at the top)
const Project = require('../models/Project');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');


exports.createProject = async (req, res, next) => {
  // 1. Check validation defined in routes/projects.js
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // 2. Extract data
  const {
    name,
    description,
    startDate,
    endDate,
    priority,
    status,
    teamMembers
  } = req.body;
  const userId = req.user.id; // From authMiddleware

  try {
    // 3. Check Project Limit
    const projectCount = await Project.countDocuments({ user: userId });
    if (projectCount >= 4) {
      // Return specific error for limit reached
      return res.status(400).json({
        errors: [{ msg: 'You have reached the maximum limit of 4 projects.' }],
      });
    }

    // 4. Create new project instance using the Model
    const newProject = new Project({
      name,
      description,
      startDate,
      endDate,
      priority,
      status,
      teamMembers: teamMembers || [],
      user: userId,
      tasks: []
    });

    // 5. Save the project to the database
    const project = await newProject.save();

    // 6. Send the created project back in the response
    res.status(201).json(project);

  } catch (err) {
    // Handle potential errors during save or countDocuments
    console.error('Create Project Controller Error:', err.message);
    next(err); // Pass error to the centralized handler
  }
};

// --- KEEP your other functions (getProjects, updateProject, deleteProject) as they were ---
// Make sure they also include 'next' and call next(err) in their catch blocks

exports.getProjects = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Get Projects Controller Error:', err.message);
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name } = req.body;
  const { projectId } = req.params;
  const userId = req.user.id;
  const updateFields = {};
  if (name) updateFields.name = name;
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ errors: [{ msg: 'No fields to update provided' }] });
  }
  try {
    let project = await Project.findById(projectId);
    if (!project) { return res.status(404).json({ errors: [{ msg: 'Project not found' }] }); }
    if (project.user.toString() !== userId) { return res.status(403).json({ errors: [{ msg: 'User not authorized to update this project' }] }); }
    project = await Project.findByIdAndUpdate(projectId, { $set: updateFields }, { new: true, runValidators: true });
    res.json(project);
  } catch (err) {
    console.error('Update Project Controller Error:', err.message);
    if (err.name === 'CastError' || err.kind === 'ObjectId') { return res.status(400).json({ errors: [{ msg: 'Invalid Project ID format' }] }); }
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  const { projectId } = req.params;
  const userId = req.user.id;
  try {
    const project = await Project.findById(projectId);
    if (!project) { return res.status(404).json({ errors: [{ msg: 'Project not found' }] }); }
    if (project.user.toString() !== userId) { return res.status(403).json({ errors: [{ msg: 'User not authorized to delete this project' }] }); }
    await Task.deleteMany({ project: projectId });
    console.log(`Deleted tasks associated with project ${projectId}`);
    await Project.findByIdAndDelete(projectId);
    res.json({ msg: 'Project and associated tasks removed successfully' });
  } catch (err) {
    console.error('Delete Project Controller Error:', err.message);
    if (err.name === 'CastError' || err.kind === 'ObjectId') { return res.status(400).json({ errors: [{ msg: 'Invalid Project ID format' }] }); }
    next(err);
  }
};