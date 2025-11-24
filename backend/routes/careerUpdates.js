const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/career-updates - Get all career updates (public)
router.get('/', async (req, res) => {
  try {
    const { type, is_featured, is_pinned, limit = 50, offset = 0 } = req.query;
    
    let query = db('career_updates')
      .select('*')
      .where('is_active', true)
      .where(function() {
        this.whereNull('publish_at').orWhere('publish_at', '<=', new Date().toISOString());
      })
      .where(function() {
        this.whereNull('expires_at').orWhere('expires_at', '>=', new Date().toISOString());
      });

    if (type) {
      query = query.where('type', type);
    }
    if (is_featured === 'true') {
      query = query.where('is_featured', true);
    }
    if (is_pinned === 'true') {
      query = query.where('is_pinned', true);
    }

    const updates = await query
      .orderBy([
        { column: 'is_pinned', order: 'desc' },
        { column: 'priority', order: 'desc' },
        { column: 'created_at', order: 'desc' },
      ])
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json(updates);
  } catch (err) {
    console.error('Error fetching career updates:', err);
    res.status(500).json({ message: 'Error fetching career updates', error: err.message });
  }
});

// GET /api/career-updates/:id - Get single update
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const update = await db('career_updates')
      .where({ id })
      .first();

    if (!update) {
      return res.status(404).json({ message: 'Career update not found' });
    }

    // Increment views
    await db('career_updates')
      .where({ id })
      .increment('views', 1);

    res.json(update);
  } catch (err) {
    console.error('Error fetching career update:', err);
    res.status(500).json({ message: 'Error fetching career update', error: err.message });
  }
});

// POST /api/career-updates - Create new career update (admin only)
router.post('/', authenticateToken, authorizeRole(['admin', 'manager']), async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      content,
      linkUrl,
      linkText,
      isExternal,
      companyName,
      companyLogoUrl,
      location,
      country,
      jobTitle,
      jobType,
      salaryRange,
      experienceLevel,
      requirements,
      applicationDeadline,
      driveStartDate,
      driveEndDate,
      driveLocation,
      imageUrl,
      videoUrl,
      priority,
      isFeatured,
      isPinned,
      publishAt,
      expiresAt,
      metadata,
      tags,
    } = req.body;

    if (!type || !title) {
      return res.status(400).json({ message: 'Type and title are required' });
    }

    const [newUpdate] = await db('career_updates')
      .insert({
        type,
        title,
        description: description || null,
        content: content || null,
        link_url: linkUrl || null,
        link_text: linkText || null,
        is_external: isExternal !== undefined ? isExternal : true,
        company_name: companyName || null,
        company_logo_url: companyLogoUrl || null,
        location: location || null,
        country: country || null,
        job_title: jobTitle || null,
        job_type: jobType || null,
        salary_range: salaryRange || null,
        experience_level: experienceLevel || null,
        requirements: requirements || null,
        application_deadline: applicationDeadline || null,
        drive_start_date: driveStartDate || null,
        drive_end_date: driveEndDate || null,
        drive_location: driveLocation || null,
        image_url: imageUrl || null,
        video_url: videoUrl || null,
        priority: priority || 0,
        is_featured: isFeatured || false,
        is_pinned: isPinned || false,
        publish_at: publishAt || null,
        expires_at: expiresAt || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        tags: tags || null,
        views: 0,
        clicks: 0,
        applications: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .returning('*');

    res.status(201).json({
      message: 'Career update created successfully',
      update: newUpdate,
    });
  } catch (err) {
    console.error('Error creating career update:', err);
    res.status(500).json({ message: 'Error creating career update', error: err.message });
  }
});

// PUT /api/career-updates/:id - Update career update (admin only)
router.put('/:id', authenticateToken, authorizeRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    // Handle JSON fields
    if (updateData.metadata && typeof updateData.metadata === 'object') {
      updateData.metadata = JSON.stringify(updateData.metadata);
    }

    const [updated] = await db('career_updates')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (!updated) {
      return res.status(404).json({ message: 'Career update not found' });
    }

    res.json({
      message: 'Career update updated successfully',
      update: updated,
    });
  } catch (err) {
    console.error('Error updating career update:', err);
    res.status(500).json({ message: 'Error updating career update', error: err.message });
  }
});

// DELETE /api/career-updates/:id - Delete career update (admin only)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await db('career_updates')
      .where({ id })
      .delete();

    if (!deleted) {
      return res.status(404).json({ message: 'Career update not found' });
    }

    res.json({ message: 'Career update deleted successfully' });
  } catch (err) {
    console.error('Error deleting career update:', err);
    res.status(500).json({ message: 'Error deleting career update', error: err.message });
  }
});

// POST /api/career-updates/:id/track-click - Track click on update
router.post('/:id/track-click', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db('career_updates')
      .where({ id })
      .increment('clicks', 1);

    res.json({ message: 'Click tracked successfully' });
  } catch (err) {
    console.error('Error tracking click:', err);
    res.status(500).json({ message: 'Error tracking click', error: err.message });
  }
});

module.exports = router;

