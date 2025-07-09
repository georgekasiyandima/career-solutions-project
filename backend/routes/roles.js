const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/roles - Get all roles
router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const roles = await db('roles')
      .select('*')
      .orderBy('created_at', 'desc');
    
    res.json(roles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ message: 'Error fetching roles' });
  }
});

// POST /api/roles - Create a new role
router.post('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { name, description, permissions, is_active = true } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Role name is required.' });
    }

    const [newRole] = await db('roles')
      .insert({
        name,
        description: description || null,
        permissions: permissions ? JSON.stringify(permissions) : null,
        is_active,
        created_at: new Date().toISOString(),
      })
      .returning('*');

    res.status(201).json(newRole);
  } catch (err) {
    console.error('Error creating role:', err);
    res.status(500).json({ message: 'Error creating role' });
  }
});

module.exports = router;