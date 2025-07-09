const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/clients - Fetch all clients
router.get('/', async (req, res) => {
  try {
    const clients = await db('clients')
      .select('*')
      .orderBy('created_at', 'desc');
    
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ message: 'Error fetching clients' });
  }
});

// POST /api/clients - Create a new client
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, category } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const [newClient] = await db('clients')
      .insert({
        name,
        email,
        phone: phone || null,
        category: category || 'general',
        created_at: new Date().toISOString(),
      })
      .returning('*');

    res.status(201).json(newClient);
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({ message: 'Error creating client' });
  }
});

// PUT /api/clients/:id - Edit a client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, category } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }
    const [updatedClient] = await db('clients')
      .where({ id })
      .update({
        name,
        email,
        phone: phone || null,
        category: category || 'general',
      })
      .returning('*');
    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found.' });
    }
    res.json(updatedClient);
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).json({ message: 'Error updating client' });
  }
});

// DELETE /api/clients/:id - Delete a client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await db('clients')
      .where({ id })
      .del();
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Client not found.' });
    }
    res.json({ message: 'Client deleted successfully.' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ message: 'Error deleting client' });
  }
});

module.exports = router;