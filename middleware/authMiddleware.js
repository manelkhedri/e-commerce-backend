const jwt = require('jsonwebtoken');

// Verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get token from request headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

 if (!decoded.userId) {
  return res.status(401).json({
    message: 'Invalid token payload'
  });
 }

    // Attach user ID to request
    req.user = decoded;

    // Continue to the next middleware or route
    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;