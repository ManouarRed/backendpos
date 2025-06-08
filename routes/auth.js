
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readData } = require('../services/dataService');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }
  if (!JWT_SECRET) {
    console.error("JWT_SECRET not configured on server for /login route.");
    return res.status(500).json({ message: "Authentication system configuration error." });
  }

  try {
    const users = await readData('users.json');
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (user && user.hashedPassword && await bcrypt.compare(password, user.hashedPassword)) {
      // User authenticated
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
      });

      // Return token and user info (excluding password)
      const { hashedPassword, password: plainPassword, ...userWithoutSensitiveData } = user;
      res.json({
        token,
        user: userWithoutSensitiveData,
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /api/auth/me (Protected Route)
router.get('/me', protect, async (req, res) => {
  // req.user is populated by the 'protect' middleware
  if (req.user) {
    // The user object in req.user already excludes sensitive data
    res.json(req.user);
  } else {
    // This case should ideally be caught by 'protect' middleware sending 401
    res.status(404).json({ message: 'User not found or token invalid after middleware pass.' });
  }
});

module.exports = router;
