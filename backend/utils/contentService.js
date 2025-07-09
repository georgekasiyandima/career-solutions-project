const db = require('../database');

class ContentService {
  // Get content with advanced filtering and pagination
  static async getContent(filters = {}, options = {}) {
    const {
      type,
      status,
      category,
      tags,
      search,
      author_id,
      is_published
    } = filters;
    
    const {
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      include_author = false
    } = options;
    
    let query = db('content').select('*');
    
    // Apply filters
    if (type) {
      query = query.where('type', type);
    }
    
    if (status) {
      query = query.where('status', status);
    }
    
    if (category) {
      query = query.where('category', 'like', `%${category}%`);
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      tagArray.forEach(tag => {
        query = query.where('tags', 'like', `%${tag}%`);
      });
    }
    
    if (search) {
      query = query.where(function() {
        this.where('title', 'like', `%${search}%`)
          .orWhere('content', 'like', `%${search}%`)
          .orWhere('meta_description', 'like', `%${search}%`);
      });
    }
    
    if (author_id) {
      query = query.where('author_id', author_id);
    }
    
    if (is_published !== undefined) {
      query = query.where('is_published', is_published);
    }
    
    // Apply sorting
    query = query.orderBy(sortBy, sortOrder);
    
    // Apply pagination
    query = query.limit(limit).offset(offset);
    
    const content = await query;
    
    // Include author information if requested
    if (include_author && content.length > 0) {
      const authorIds = [...new Set(content.map(item => item.author_id).filter(Boolean))];
      if (authorIds.length > 0) {
        const authors = await db('users')
          .whereIn('id', authorIds)
          .select('id', 'name', 'email');
        
        const authorMap = {};
        authors.forEach(author => {
          authorMap[author.id] = author;
        });
        
        content.forEach(item => {
          item.author = authorMap[item.author_id] || null;
        });
      }
    }
    
    return content;
  }

  // Create content with validation
  static async createContent(data, authorId) {
    const {
      title,
      content: body,
      type = 'article',
      status = 'draft',
      category,
      tags,
      image_url,
      meta_description,
      seo_keywords,
      is_published = false,
      featured = false,
      allow_comments = true
    } = data;
    
    // Validation
    if (!title || !body) {
      throw new Error('Title and content are required.');
    }
    
    if (title.length < 3 || title.length > 255) {
      throw new Error('Title must be between 3 and 255 characters.');
    }
    
    if (body.length < 50) {
      throw new Error('Content must be at least 50 characters long.');
    }
    
    const contentData = {
      title,
      content: body,
      type,
      status,
      category,
      tags: tags ? JSON.stringify(tags) : null,
      image_url,
      meta_description,
      seo_keywords,
      is_published,
      featured,
      allow_comments,
      author_id: authorId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const [newContent] = await db('content')
      .insert(contentData)
      .returning('*');
    
    return newContent;
  }

  // Update content with validation
  static async updateContent(id, data, authorId) {
    const content = await db('content').where({ id }).first();
    if (!content) {
      throw new Error('Content not found.');
    }
    
    // Check if user has permission to edit
    if (content.author_id !== authorId) {
      throw new Error('You do not have permission to edit this content.');
    }
    
    const {
      title,
      content: body,
      type,
      status,
      category,
      tags,
      image_url,
      meta_description,
      seo_keywords,
      is_published,
      featured,
      allow_comments
    } = data;
    
    // Validation
    if (title && (title.length < 3 || title.length > 255)) {
      throw new Error('Title must be between 3 and 255 characters.');
    }
    
    if (body && body.length < 50) {
      throw new Error('Content must be at least 50 characters long.');
    }
    
    const updateData = {
      ...(title && { title }),
      ...(body && { content: body }),
      ...(type && { type }),
      ...(status && { status }),
      ...(category !== undefined && { category }),
      ...(tags !== undefined && { tags: tags ? JSON.stringify(tags) : null }),
      ...(image_url !== undefined && { image_url }),
      ...(meta_description !== undefined && { meta_description }),
      ...(seo_keywords !== undefined && { seo_keywords }),
      ...(is_published !== undefined && { is_published }),
      ...(featured !== undefined && { featured }),
      ...(allow_comments !== undefined && { allow_comments }),
      updated_at: new Date().toISOString()
    };
    
    const [updatedContent] = await db('content')
      .where({ id })
      .update(updateData)
      .returning('*');
    
    return updatedContent;
  }

  // Delete content with permission check
  static async deleteContent(id, authorId) {
    const content = await db('content').where({ id }).first();
    if (!content) {
      throw new Error('Content not found.');
    }
    
    // Check if user has permission to delete
    if (content.author_id !== authorId) {
      throw new Error('You do not have permission to delete this content.');
    }
    
    const deletedCount = await db('content').where({ id }).del();
    return deletedCount > 0;
  }

  // Publish/unpublish content
  static async togglePublishStatus(id, authorId) {
    const content = await db('content').where({ id }).first();
    if (!content) {
      throw new Error('Content not found.');
    }
    
    if (content.author_id !== authorId) {
      throw new Error('You do not have permission to modify this content.');
    }
    
    const newStatus = !content.is_published;
    
    const [updatedContent] = await db('content')
      .where({ id })
      .update({
        is_published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .returning('*');
    
    return updatedContent;
  }

  // Get content statistics
  static async getContentStats(authorId = null) {
    let query = db('content');
    
    if (authorId) {
      query = query.where('author_id', authorId);
    }
    
    const [total, published, drafts, featured] = await Promise.all([
      query.clone().count('id as count').first(),
      query.clone().where('is_published', true).count('id as count').first(),
      query.clone().where('is_published', false).count('id as count').first(),
      query.clone().where('featured', true).count('id as count').first()
    ]);
    
    return {
      total: parseInt(total.count),
      published: parseInt(published.count),
      drafts: parseInt(drafts.count),
      featured: parseInt(featured.count)
    };
  }

  // Get content by category
  static async getContentByCategory(category, options = {}) {
    return await this.getContent({ category }, options);
  }

  // Get featured content
  static async getFeaturedContent(limit = 5) {
    return await db('content')
      .where({ featured: true, is_published: true })
      .orderBy('created_at', 'desc')
      .limit(limit);
  }

  // Get recent content
  static async getRecentContent(limit = 10) {
    return await db('content')
      .where({ is_published: true })
      .orderBy('created_at', 'desc')
      .limit(limit);
  }

  // Get content categories
  static async getContentCategories() {
    const categories = await db('content')
      .whereNotNull('category')
      .distinct('category')
      .select('category');
    
    return categories.map(c => c.category).filter(Boolean);
  }

  // Get content tags
  static async getContentTags() {
    const content = await db('content')
      .whereNotNull('tags')
      .select('tags');
    
    const allTags = [];
    content.forEach(item => {
      try {
        const tags = JSON.parse(item.tags);
        if (Array.isArray(tags)) {
          allTags.push(...tags);
        }
      } catch (e) {
        // Ignore invalid JSON
      }
    });
    
    return [...new Set(allTags)];
  }

  // Search content with advanced features
  static async searchContent(searchTerm, options = {}) {
    const { limit = 20, offset = 0, type, category } = options;
    
    let query = db('content')
      .where(function() {
        this.where('title', 'like', `%${searchTerm}%`)
          .orWhere('content', 'like', `%${searchTerm}%`)
          .orWhere('meta_description', 'like', `%${searchTerm}%`)
          .orWhere('seo_keywords', 'like', `%${searchTerm}%`);
      })
      .where('is_published', true);
    
    if (type) {
      query = query.where('type', type);
    }
    
    if (category) {
      query = query.where('category', 'like', `%${category}%`);
    }
    
    return await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }

  // Duplicate content
  static async duplicateContent(id, authorId) {
    const content = await db('content').where({ id }).first();
    if (!content) {
      throw new Error('Content not found.');
    }
    
    const duplicateData = {
      ...content,
      id: undefined, // Remove ID to create new record
      title: `${content.title} (Copy)`,
      is_published: false,
      featured: false,
      author_id: authorId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const [newContent] = await db('content')
      .insert(duplicateData)
      .returning('*');
    
    return newContent;
  }
}

module.exports = ContentService; 