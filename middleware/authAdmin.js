const jwt = require('jsonwebtoken');

function authAdmin(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    const token = bearerHeader.split(' ')[1];  


    const decoded = jwt.decode(token); 

    jwt.verify(token, process.env.JWT_SECRET_ADMIN, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token.' });
        }

        req.decoded = decoded;
        next();
    });
}

module.exports = authAdmin;