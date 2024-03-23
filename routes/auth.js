const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ "message": "Unauthorized: Token missing" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ "message": "Unauthorized: Token expired" });
        } else {
          return res.status(403).json({ "message": "Forbidden: Invalid token" });
        }
      }
      if (!decoded || !decoded.email) {
        return res.status(403).json({ "message": "Forbidden: Token does not contain email" });
      }
      const userEmailFromToken = decoded.email;
      if (userEmailFromToken !== (req.params.email || req.body.email)) {
        return res.status(403).json({ "message": "Forbidden: Token does not match user's email" });
      }
      req.user = decoded;
      next();
    });
  }
  module.exports = authenticateToken;