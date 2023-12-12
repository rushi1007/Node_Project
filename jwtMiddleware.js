// jwtMiddleware.js
const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    console.log('Received token:', token);

    if (!token) {
        return res.status(401).json({ message: 'Missing or invalid token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.exp * 1000 < Date.now()) {
            return res.status(401).json({ message: 'Token has expired' });
        }

        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = jwtMiddleware;
