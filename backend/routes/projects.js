// backend/routes/projects.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

// Import updated controller functions
const {
    createProject,
    getProjects,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

// @route   POST api/projects
// @desc    Create a new project
// @access  Private
router.post('/', [
    authMiddleware,
    check('name', 'Project name is required').not().isEmpty().trim(),
    check('description', 'Description cannot be more than 1000 characters').optional().isLength({ max: 1000 }),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('endDate', 'End date is required').not().isEmpty(),
    check('priority', 'Priority must be Low, Medium, or High').optional().isIn(['Low', 'Medium', 'High']),
    check('status', 'Status must be Not Started, In Progress, On Hold, or Completed').optional().isIn(['Not Started', 'In Progress', 'On Hold', 'Completed']),
    check('teamMembers', 'Team members must be an array of user IDs').optional().isArray()
], createProject);

// @route   GET api/projects
// @desc    Get all projects for the authenticated user
// @access  Private
router.get('/', authMiddleware, getProjects);

// @route   PUT api/projects/:projectId
// @desc    Update a project
// @access  Private
router.put(
    '/:projectId',
    [
        authMiddleware,
        check('name', 'Project name cannot be empty').optional().not().isEmpty().trim(),
        check('description', 'Description cannot be more than 1000 characters').optional().isLength({ max: 1000 }),
        check('startDate', 'Start date is required').optional().not().isEmpty(),
        check('endDate', 'End date is required').optional().not().isEmpty(),
        check('priority', 'Priority must be Low, Medium, or High').optional().isIn(['Low', 'Medium', 'High']),
        check('status', 'Status must be Not Started, In Progress, On Hold, or Completed').optional().isIn(['Not Started', 'In Progress', 'On Hold', 'Completed']),
        check('teamMembers', 'Team members must be an array of user IDs').optional().isArray()
    ],
    updateProject
);

// @route   DELETE api/projects/:projectId
// @desc    Delete a project and its tasks
// @access  Private
router.delete(
    '/:projectId',
    authMiddleware,
    deleteProject
);

module.exports = router;