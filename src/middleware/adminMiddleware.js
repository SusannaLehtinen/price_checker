const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // 1. Check for token
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Authentication failed: No Authorization header' });
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: No token provided' });
        }

        // 2. Verify token and get user data
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { userId: decodedToken.userId, email: decodedToken.email, role: decodedToken.role };

        // 3. Check if user is an admin
        if (req.userData.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin role required' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed: Invalid or expired token' });
    }
};
