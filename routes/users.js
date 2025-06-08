
const express = require('express');
const bcrypt = require('bcryptjs');
const { readData, writeData, generateId } = require('../services/dataService');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users (Admin only)
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const users = await readData('users.json');
    // Exclude passwords from the response
    const usersWithoutPasswords = users.map(({ hashedPassword, password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users: " + error.message });
  }
});

// POST /api/users (Admin only - Add new user)
router.post('/', protect, isAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }
  if (!['admin', 'employee'].includes(role)) {
    return res.status(400).json({ message: "Invalid role. Must be 'admin' or 'employee'." });
  }

  try {
    const users = await readData('users.json');
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return res.status(400).json({ message: `Username "${username}" already exists.` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: generateId('user_'),
      username,
      hashedPassword,
      role,
    };
    users.push(newUser);
    await writeData('users.json', users);

    // Return new user without password
    const { hashedPassword: _, ...userToReturn } = newUser;
    res.status(201).json(userToReturn);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Failed to add user: " + error.message });
  }
});

// PUT /api/users/:id (Admin only - Update user)
router.put('/:id', protect, isAdmin, async (req, res) => {
  const userIdToUpdate = req.params.id;
  const { username, password, role } = req.body; // password is optional

  if (!username && !password && !role) {
      return res.status(400).json({ message: "No update data provided. Please provide username, password, or role." });
  }

  try {
    let users = await readData('users.json');
    const userIndex = users.findIndex(u => u.id === userIdToUpdate);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found." });
    }

    const userToUpdate = { ...users[userIndex] }; // Copy existing user

    // Validate username if provided and changed
    if (username && username !== userToUpdate.username) {
      if (users.some(u => u.id !== userIdToUpdate && u.username.toLowerCase() === username.toLowerCase())) {
        return res.status(400).json({ message: `Username "${username}" already exists.` });
      }
      userToUpdate.username = username;
    }

    // Hash password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long." });
      }
      const salt = await bcrypt.genSalt(10);
      userToUpdate.hashedPassword = await bcrypt.hash(password, salt);
    }

    // Validate role if provided and changed
    if (role) {
      if (!['admin', 'employee'].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'admin' or 'employee'." });
      }
      // Prevent self-demotion if current admin is editing themselves and they are the only admin
      if (req.user.id === userIdToUpdate && userToUpdate.role === 'admin' && role === 'employee') {
        const adminUsers = users.filter(u => u.role === 'admin');
        if (adminUsers.length === 1 && adminUsers[0].id === userIdToUpdate) {
          return res.status(400).json({ message: "Cannot change role. You are the only admin." });
        }
      }
      userToUpdate.role = role;
    }
    
    users[userIndex] = userToUpdate;
    await writeData('users.json', users);

    const { hashedPassword, password: plainPassword, ...userToReturn } = userToUpdate;
    res.json(userToReturn);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user: " + error.message });
  }
});

// DELETE /api/users/:id (Admin only - Delete user)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  const userIdToDelete = req.params.id;

  if (req.user.id === userIdToDelete) {
    return res.status(400).json({ success: false, message: "You cannot delete your own account." });
  }

  try {
    let users = await readData('users.json');
    const initialLength = users.length;
    users = users.filter(u => u.id !== userIdToDelete);

    if (users.length < initialLength) {
      await writeData('users.json', users);
      res.json({ success: true, message: "User deleted successfully." });
    } else {
      res.status(404).json({ success: false, message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user: " + error.message });
  }
});

module.exports = router;
