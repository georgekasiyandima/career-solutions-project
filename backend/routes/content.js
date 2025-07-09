const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/content - Fetch all content items
router.get('/', async (req, res) => {
  try {
    const content = await db('content')
      .select('*')
      .orderBy('created_at', 'desc');
    
    res.json(content);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ message: 'Error fetching content' });
  }
});

// POST /api/content - Create a new content item
router.post('/', async (req, res) => {
  try {
    const { title, content: body, type, status, category, tags, image_url, meta_description, seo_keywords } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const [newContent] = await db('content')
      .insert({
        title,
        content: body,
        type: type || 'article',
        status: status || 'draft',
        category: category || null,
        tags: tags || null,
        image_url: image_url || null,
        meta_description: meta_description || null,
        seo_keywords: seo_keywords || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning('*');

    res.status(201).json(newContent);
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ message: 'Error creating content' });
  }
});

// PUT /api/content/:id - Update a content item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content: body, type, status, category, tags, image_url, meta_description, seo_keywords } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const [updatedContent] = await db('content')
      .where({ id })
      .update({
        title,
        content: body,
        type: type || 'article',
        status: status || 'draft',
        category: category || null,
        tags: tags || null,
        image_url: image_url || null,
        meta_description: meta_description || null,
        seo_keywords: seo_keywords || null,
        updated_at: new Date().toISOString()
      })
      .returning('*');

    if (!updatedContent) {
      return res.status(404).json({ message: 'Content not found.' });
    }

    res.json(updatedContent);
  } catch (err) {
    console.error('Error updating content:', err);
    res.status(500).json({ message: 'Error updating content' });
  }
});

// DELETE /api/content/:id - Delete a content item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await db('content')
      .where({ id })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Content not found.' });
    }

    res.json({ message: 'Content deleted successfully.' });
  } catch (err) {
    console.error('Error deleting content:', err);
    res.status(500).json({ message: 'Error deleting content' });
  }
});

// --- SEO ANALYSIS UTILITY ---
function analyzeSEO({ title, meta_description, seo_keywords, content }) {
  const report = {};
  // Title length
  report.titleLength = title ? title.length : 0;
  report.titleOk = report.titleLength >= 30 && report.titleLength <= 60;
  // Meta description
  report.seoDescriptionLength = meta_description ? meta_description.length : 0;
  report.seoDescriptionOk = report.seoDescriptionLength >= 70 && report.seoDescriptionLength <= 160;
  // Tags/keywords
  const keywords = seo_keywords ? seo_keywords.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];
  report.keywords = keywords;
  // Keyword usage in title/content
  report.keywordsInTitle = keywords.filter(k => title && title.toLowerCase().includes(k));
  report.keywordsInContent = keywords.filter(k => content && content.toLowerCase().includes(k));
  // Keyword density (simple)
  const contentWordCount = content ? content.split(/\s+/).length : 0;
  report.contentWordCount = contentWordCount;
  report.keywordDensity = {};
  keywords.forEach(k => {
    const count = content ? (content.toLowerCase().match(new RegExp(`\\b${k}\\b`, 'g')) || []).length : 0;
    report.keywordDensity[k] = contentWordCount ? (count / contentWordCount * 100).toFixed(2) : '0.00';
  });
  // Suggestions
  report.suggestions = [];
  let score = 100;
  if (!report.titleOk) { report.suggestions.push('Title should be 30-60 characters.'); score -= 10; }
  if (!report.seoDescriptionOk) { report.suggestions.push('Meta description should be 70-160 characters.'); score -= 10; }
  if (keywords.length === 0) { report.suggestions.push('Add SEO keywords for better SEO.'); score -= 10; }
  if (contentWordCount < 300) { report.suggestions.push('Content is short. Aim for at least 300 words.'); score -= 10; }
  keywords.forEach(k => {
    if (!report.keywordsInTitle.includes(k)) { report.suggestions.push(`Keyword "${k}" not found in title.`); score -= 5; }
    if (!report.keywordsInContent.includes(k)) { report.suggestions.push(`Keyword "${k}" not found in content.`); score -= 5; }
    const density = parseFloat(report.keywordDensity[k]);
    if (density < 0.5) { report.suggestions.push(`Keyword "${k}" density is low (${density}%).`); score -= 5; }
    if (density > 3) { report.suggestions.push(`Keyword "${k}" density is high (${density}%).`); score -= 5; }
  });
  report.score = Math.max(0, Math.min(100, score));
  return report;
}

// --- SEO REPORT ENDPOINT ---
router.get('/:id/seo-report', async (req, res) => {
  try {
    const { id } = req.params;
    const content = await db('content').where({ id }).first();
    if (!content) {
      return res.status(404).json({ message: 'Content not found.' });
    }
    const report = analyzeSEO({
      title: content.title,
      meta_description: content.meta_description,
      seo_keywords: content.seo_keywords,
      content: content.content
    });
    res.json(report);
  } catch (err) {
    console.error('SEO report error:', err);
    res.status(500).json({ message: 'Failed to generate SEO report.' });
  }
});

module.exports = router; 