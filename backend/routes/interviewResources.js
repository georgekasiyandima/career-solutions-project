const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/interview-resources - Get all interview resources
router.get('/', async (req, res) => {
  try {
    const { type, category, tag, q } = req.query;
    let query = db('interview_resources').where('is_published', true);
    if (type) query = query.andWhere('type', type);
    if (category) query = query.andWhere('category', category);
    if (tag) query = query.andWhereRaw('tags LIKE ?', [`%${tag}%`] );
    if (q) query = query.andWhere('title', 'like', `%${q}%`);
    const resources = await query.orderBy('created_at', 'desc');
    res.json(resources);
  } catch (error) {
    console.error('Error fetching interview resources:', error);
    res.status(500).json({ message: 'Failed to fetch resources.' });
  }
});

// GET /api/interview-resources/:id - Get a specific resource
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await db('interview_resources')
      .where({ id })
      .first();
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ message: 'Failed to fetch resource.' });
  }
});

// POST /api/interview-resources - Create a new resource
router.post('/', async (req, res) => {
  try {
    const { title, type, category, content, tags, download_url, difficulty, is_published } = req.body;
    if (!title || !type || !content) {
      return res.status(400).json({ message: 'Title, type, and content are required.' });
    }
    const [id] = await db('interview_resources').insert({
      title,
      type,
      category,
      content,
      tags,
      download_url,
      difficulty,
      is_published: is_published !== undefined ? is_published : true,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const newResource = await db('interview_resources').where('id', id).first();
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ message: 'Failed to create resource.' });
  }
});

// PUT /api/interview-resources/:id - Update a resource
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, category, content, tags, download_url, difficulty, is_published } = req.body;
    
    if (!title || !type || !content) {
      return res.status(400).json({ message: 'Title, type, and content are required.' });
    }

    const [updatedResource] = await db('interview_resources')
      .where({ id })
      .update({
        title,
        type,
        category,
        content,
        tags,
        download_url,
        difficulty,
        is_published: is_published !== undefined ? is_published : true,
        updated_at: new Date()
      })
      .returning('*');

    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ message: 'Failed to update resource.' });
  }
});

// DELETE /api/interview-resources/:id - Delete a resource
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await db('interview_resources')
      .where({ id })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Failed to delete resource.' });
  }
});

module.exports = router; 