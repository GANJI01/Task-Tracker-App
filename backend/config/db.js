// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    // Mongoose >= 6 doesn't require the options object like useNewUrlParser etc.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log success message including the host it connected to
    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    // Log the error message if connection fails
    console.error(`Error connecting to MongoDB: ${error.message}`);

    // Exit the Node.js process with failure status code (1)
    // If we can't connect to the DB, the app likely can't run correctly.
    process.exit(1);
  }
};

// Export the function so it can be imported and used in server.js
module.exports = connectDB;