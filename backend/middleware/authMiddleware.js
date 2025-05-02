// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
// No need to require dotenv here if it's already called in server.js before routes
// However, ensure JWT_SECRET is loaded into process.env before this runs.

module.exports = function(req, res, next) {
  // 1. Get token from header
  const token = req.header('Authorization'); // Check common header first

  // More robust check: often token is sent as "Bearer <token>"
  let actualToken = token;
  if (token && token.startsWith('Bearer ')) {
    // Extract the token part after "Bearer "
    actualToken = token.substring(7, token.length);
  }

  // 2. Check if no token found
  if (!actualToken) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Verify token
  try {
    // jwt.verify() decodes the token and checks its validity/expiration
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // 4. Attach user info from payload to request object
    // The payload we created in authController contained { user: { id: user.id } }
    req.user = decoded.user; // Adds { id: 'user_id_here' } to req

    // 5. Call next() to proceed to the next middleware or route handler
    next();

  } catch (err) {
    // Handle different JWT errors (optional but good)
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
    if (err.name === 'TokenExpiredError') {
       return res.status(401).json({ msg: 'Token has expired' });
    }
    // Generic error for other issues
    console.error('JWT Middleware Error:', err.message);
    res.status(401).json({ msg: 'Token validation failed' });
  }
};