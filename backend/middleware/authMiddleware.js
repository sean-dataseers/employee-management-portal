const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // 1. Grab the Authorization header
  const authHeader = req.headers.authorization;

  // 2. Make sure it exists and is formatted as "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // 3. Extract just the token part (everything after "Bearer ")
  const token = authHeader.split(' ')[1];

  // 4. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // attach the decoded info to the request
    next();               // let the request continue to the controller
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;