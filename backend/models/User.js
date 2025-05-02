// backend/models/User.js

const mongoose = require('mongoose');

// Define the schema for the User model
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'], // Makes the field required, provides error message
      trim: true, // Removes whitespace from beginning and end
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true, // Ensures no two users can have the same email
      match: [
        // Basic regex for email validation
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      trim: true,
      lowercase: true, // Stores email in lowercase for consistency
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6, // Example: Enforce minimum password length
      select: false, // Prevents password from being returned in queries by default
    },
    country: {
      type: String,
      trim: true,
      // You might add 'required: true' if country is mandatory
      // required: [true, 'Please add a country'],
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Export the model, making it available for use in other files.
// Mongoose will create a collection named 'users' (pluralized, lowercase version of 'User')
module.exports = mongoose.model('User', UserSchema);