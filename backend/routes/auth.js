const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Toegang geweigerd' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Ongeldige token' });
  }
};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Gebruiker niet gevonden' });
    }

    // Check password
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Ongeldig wachtwoord' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route (admin only)
router.post('/register', verifyToken, async (req, res) => {
  try {
    // Check if requester is admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: 'Alleen administrators kunnen nieuwe gebruikers registreren' });
    }

    const { username, password, isAdmin } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Gebruikersnaam bestaat al' });
    }

    // Create new user
    const user = new User({
      username,
      password,
      isAdmin: isAdmin || false,
    });

    await user.save();
    res.status(201).json({ message: 'Gebruiker succesvol aangemaakt' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {
  router,
  verifyToken,
};
