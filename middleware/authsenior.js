const jwt = require('jsonwebtoken');

function authseniorcore(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    const token = bearerHeader.split(' ')[1];  


    const decoded = jwt.decode(token); 

    jwt.verify(token, process.env.JWT_SECRET_SENIORCORE, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: 'Failed to authenticate token.' });
        }

        req.decoded = decoded;
        next();
    });
}

module.exports = authseniorcore;