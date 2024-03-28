const jwt = require('jsonwebtoken');

function authenticateToken2(req, res, next) {
    const cookieHeader = req.headers.cookie;
    const cookie = cookieHeader && cookieHeader.split('; ').find(cookie => cookie.trim().startsWith('email='));
    
    const userEmailFromCookie = cookie && cookie.split('=')[1];
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    console.log(token);
    console.log(userEmailFromCookie);
    
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
      if (userEmailFromToken !== userEmailFromCookie) {
        return res.status(403).json({ "message": "Forbidden: Token does not match user's email" });
      }
      
      req.user = decoded;
      next();
    });
}

module.exports = authenticateToken2;
