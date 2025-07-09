const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET /api/users - Fetch all users (for admin)
router.get('/', async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'email_verified', 'last_login', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc');
    
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// GET /api/users/:id - Get a specific user
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db('users')
      .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'email_verified', 'avatar_url', 'last_login', 'created_at', 'updated_at')
      .where({ id })
      .first();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// POST /api/users - Create a new user (for admin)
router.post('/', async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, role } = req.body;
    
    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).json({ message: 'Username, email, password, first name, and last name are required.' });
    }

    // Check if user already exists
    const existingUser = await db('users')
      .where({ username })
      .orWhere({ email })
      .first();
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [newUser] = await db('users')
      .insert({
        username,
        email,
        password_hash,
        first_name,
        last_name,
        role: role || 'user',
        is_active: true,
        email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning(['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'email_verified', 'created_at']);

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// PUT /api/users/:id - Update a user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, first_name, last_name, role, is_active, email_verified } = req.body;
    
    if (!username || !email || !first_name || !last_name) {
      return res.status(400).json({ message: 'Username, email, first name, and last name are required.' });
    }

    // Update user
    const [updatedUser] = await db('users')
      .where({ id })
      .update({
        username,
        email,
        first_name,
        last_name,
        role: role || 'user',
        is_active: is_active !== undefined ? is_active : true,
        email_verified: email_verified !== undefined ? email_verified : false,
        updated_at: new Date().toISOString()
      })
      .returning(['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'email_verified', 'updated_at']);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await db('users')
      .where({ id })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// POST /api/users/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;

    // Basic validation
    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await db('users')
      .where({ username })
      .orWhere({ email })
      .first();
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [newUser] = await db('users')
      .insert({
        username,
        email,
        password_hash,
        first_name,
        last_name,
        role: 'user',
        is_active: true,
        email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning(['id', 'username', 'email', 'first_name', 'last_name', 'role']);

    // Generate JWT token
    const token = jwt.sign({ username, id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully.', token, user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/users/login - User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Find user
    const user = await db('users')
      .where({ username })
      .first();
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Update last login
    await db('users')
      .where({ id: user.id })
      .update({ last_login: new Date().toISOString() });

    // Generate JWT token
    const token = jwt.sign({ username, id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      message: 'Login successful.', 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router; 