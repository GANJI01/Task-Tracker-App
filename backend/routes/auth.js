// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // For input validation

// Import the controller functions (we'll create these next)
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post(
  '/signup',
  [
    // --- Input Validation Rules ---
    check('name', 'Name is required').not().isEmpty().trim(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    // Add check for 'country' if it's required in your User model
    // check('country', 'Country is required').not().isEmpty().trim(),
  ],
  signup // Call the signup function from the controller
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    // --- Input Validation Rules ---
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists(),
  ],
  login // Call the login function from the controller
);

// @route   POST api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  '/forgot-password',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  ],
  forgotPassword
);

// @route   POST api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post(
  '/reset-password',
  [
    check('token', 'Token is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  resetPassword
);

module.exports = router; // Export the router to be used in server.js