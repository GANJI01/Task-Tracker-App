// backend/middleware/errorMiddleware.js

// Custom error handler middleware
// Needs to have four arguments: err, req, res, next
const errorHandler = (err, req, res, next) => {
    // Determine status code: Use error's status code if it exists, otherwise default to 500 (Internal Server Error)
    const statusCode = err.statusCode || res.statusCode || 500;
  
    console.error(`[ERROR] ${statusCode} - ${err.message}\n`, err.stack); // Log the error details on the server
  
    // Send back a JSON response
    res.status(statusCode).json({
      success: false, // Indicate failure
      message: err.message || 'Internal Server Error', // Use error's message or a generic one
      // Optionally include stack trace only in development mode for debugging
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      // You could add more fields like error code, error kind, etc.
      // error_code: err.code,
      // kind: err.kind
    });
  };
  
  module.exports = errorHandler;