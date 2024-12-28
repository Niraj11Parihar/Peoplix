const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("No token provided.");
    return res.status(403).json({ message: "No token provided, access denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { 
      id: decoded.id, 
      role: decoded.role, 
      adminId: decoded.adminId 
    };

    next(); 
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token, please log in again." });
  }
};

module.exports = { verifyToken };
