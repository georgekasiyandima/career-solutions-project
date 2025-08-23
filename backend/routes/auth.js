const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

// --- User Registration ---
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;

    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await db('users').where({ email }).orWhere({ username }).first();
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userId] = await db('users').insert({
      username,
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      role: 'user', // Default role
    }).returning('id');

    res.status(201).json({ message: 'User registered successfully.', userId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// --- User Login ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Fetch the role name from the roles table
    const role = await db('roles').where({ id: user.role_id }).first();

    // Create a short-lived access token
    const accessToken = jwt.sign(
      { id: user.id, role: role ? role.name : null },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Create a long-lived refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Store the refresh token in an HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Store session in the database (optional, but good for tracking)
    await db('user_sessions').insert({
      user_id: user.id,
      token: refreshToken, // Store the refresh token for session tracking
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });

    // Return user data without the password hash, and include role name
    const { password_hash, ...userResponse } = user;

    res.json({
      message: 'Login successful.',
      accessToken,
      user: {
        ...userResponse,
        role: role ? role.name : null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// --- Refresh Access Token ---
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Optional: Check if the refresh token is still valid in the database
    const session = await db('user_sessions').where({ token: refreshToken }).first();
    if (!session) {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }

    const user = await db('users').where({ id: decoded.id }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    const role = await db('roles').where({ id: user.role_id }).first();

    const newAccessToken = jwt.sign(
      { id: user.id, role: role ? role.name : null },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    // If the refresh token is invalid, clear the cookie
    res.clearCookie('refreshToken');
    return res.status(403).json({ message: 'Invalid refresh token.' });
  }
});


// --- User Logout ---
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (token) {
            // Invalidate the token by deleting the session
            await db('user_sessions').where({ token: req.cookies.refreshToken }).del();
        }
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logout successful.' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout.' });
    }
});

// --- Get Current User Profile ---
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await db('users').where({ id: req.user.id }).select('id', 'email', 'first_name', 'last_name', 'role_id').first();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        const role = await db('roles').where({ id: user.role_id }).first();
        user.role = role ? role.name : null;
        delete user.role_id;

        res.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch user profile.' });
    }
});


module.exports = router; 