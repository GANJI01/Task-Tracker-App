// 1. Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 2. Load environment variables from .env file
dotenv.config();

// 3. Connect to Database
connectDB();

// 4. Initialize the Express application
const app = express();

// 5. Define the port (ONLY ONCE)
const PORT = process.env.PORT || 5000; // Define PORT here

// 6. Apply Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 7. Basic Route for Testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 8. Define Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// --- Error Handling Middleware --- // MUST BE AFTER ROUTES
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// --- Start the server --- // Use the PORT defined earlier
// const PORT = process.env.PORT || 5000; // <-- REMOVE THIS LINE

app.listen(PORT, () => { // Use the PORT variable from line 16
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Optional: Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Consider closing the server gracefully in a real application
  // For example:
  // console.log('Shutting down server due to Unhandled Promise Rejection');
  // server.close(() => process.exit(1)); // Need to capture the server instance from app.listen for this
});