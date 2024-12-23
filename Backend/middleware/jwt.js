const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from 'Authorization' header

  if (!token) {
    return res.status(403).json({ message: "No token provided, access denied." }); // Return 403 if token is missing
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user data (id, role, adminId) to the request object
    req.user = { 
      id: decoded.id, 
      role: decoded.role, 
      adminId: decoded.adminId // Attach the adminId from the decoded token
    };

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Handle invalid or expired token
    res.status(401).json({ message: "Invalid or expired token, please log in again." });
  }
};

module.exports = { verifyToken };
