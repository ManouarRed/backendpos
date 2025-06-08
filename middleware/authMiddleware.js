
const jwt = require('jsonwebtoken');
const { readData } = require('../services/dataService');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file. Authentication will not work.");
    // process.exit(1); // Optionally exit if JWT_SECRET is critical for app to run
}

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Get user from data file (excluding password)
      const users = await readData('users.json');
      const foundUser = users.find(u => u.id === decoded.id);

      if (!foundUser) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      // Attach user to request object, excluding password details
      const { hashedPassword, password, ...userWithoutSensitiveData } = foundUser;
      req.user = userWithoutSensitiveData; 

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }
};

module.exports = { protect, isAdmin };
