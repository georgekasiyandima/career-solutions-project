const express = require('express');
const router = express.Router();
const SearchService = require('../utils/searchService');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/search - Global search across all tables
router.get('/', async (req, res) => {
  try {
    const { q, limit, offset, tables } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required.' });
    }
    
    const options = {
      limit: parseInt(limit) || 10,
      offset: parseInt(offset) || 0,
      tables: tables ? tables.split(',') : ['jobs', 'content', 'feed_posts', 'interview_resources']
    };
    
    const results = await SearchService.globalSearch(q, options);
    
    res.json({
      query: q,
      results,
      total: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error performing search.' });
  }
});

// GET /api/search/jobs - Search jobs with filters
router.get('/jobs', async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      job_type,
      experience_level,
      category,
      is_active,
      limit,
      offset,
      sortBy,
      sortOrder
    } = req.query;
    
    const filters = {
      title,
      company,
      location,
      job_type,
      experience_level,
      category,
      is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined
    };
    
    const options = {
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
      sortBy: sortBy || 'created_at',
      sortOrder: sortOrder || 'desc'
    };
    
    const results = await SearchService.searchJobs(filters, options);
    
    res.json({
      filters,
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).json({ message: 'Error searching jobs.' });
  }
});

// GET /api/search/suggestions - Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q, table, field, limit } = req.query;
    
    if (!q || !table) {
      return res.status(400).json({ message: 'Query and table are required.' });
    }
    
    const suggestions = await SearchService.getSearchSuggestions(
      q,
      table,
      field || 'title',
      parseInt(limit) || 5
    );
    
    res.json({ suggestions });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ message: 'Error getting search suggestions.' });
  }
});

module.exports = router; 