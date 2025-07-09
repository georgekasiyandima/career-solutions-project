const db = require('../database');

class SearchService {
  // Global search across multiple tables
  static async globalSearch(query, options = {}) {
    const { limit = 10, offset = 0, tables = ['jobs', 'content', 'feed_posts', 'interview_resources'] } = options;
    
    const results = {};
    
    // Search in parallel for better performance
    const searchPromises = tables.map(table => {
      switch (table) {
        case 'jobs':
          return this.searchJobs({ title: query, description: query }, { limit, offset });
        case 'content':
          return this.searchContent({ title: query, body: query }, { limit, offset });
        case 'feed_posts':
          return this.searchFeedPosts({ title: query, content: query }, { limit, offset });
        case 'interview_resources':
          return this.searchInterviewResources({ title: query, description: query }, { limit, offset });
        case 'clients':
          return this.searchClients({ name: query, category: query }, { limit, offset });
        case 'users':
          return this.searchUsers({ name: query, email: query }, { limit, offset });
        default:
          return Promise.resolve([]);
      }
    });
    
    const searchResults = await Promise.all(searchPromises);
    
    tables.forEach((table, index) => {
      results[table] = searchResults[index];
    });
    
    return results;
  }

  // Advanced job search with multiple filters
  static async searchJobs(filters = {}, options = {}) {
    const {
      title,
      company,
      location,
      job_type,
      experience_level,
      category,
      salary_min,
      salary_max,
      is_active,
      is_remote,
      created_after,
      created_before
    } = filters;
    
    const {
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;
    
    let query = db('jobs').select('*');
    
    // Apply filters
    if (title) {
      query = query.where(function() {
        this.where('title', 'like', `%${title}%`)
          .orWhere('description', 'like', `%${title}%`);
      });
    }
    
    if (company) {
      query = query.where('company', 'like', `%${company}%`);
    }
    
    if (location) {
      query = query.where(function() {
        this.where('location', 'like', `%${location}%`)
          .orWhere('location_type', 'like', `%${location}%`);
      });
    }
    
    if (job_type) {
      query = query.where('job_type', job_type);
    }
    
    if (experience_level) {
      query = query.where('experience_level', experience_level);
    }
    
    if (category) {
      query = query.where('category', 'like', `%${category}%`);
    }
    
    if (salary_min) {
      query = query.where('salary_min', '>=', parseInt(salary_min));
    }
    
    if (salary_max) {
      query = query.where('salary_max', '<=', parseInt(salary_max));
    }
    
    if (is_active !== undefined) {
      query = query.where('is_active', is_active);
    }
    
    if (is_remote !== undefined) {
      query = query.where('is_remote', is_remote);
    }
    
    if (created_after) {
      query = query.where('created_at', '>=', created_after);
    }
    
    if (created_before) {
      query = query.where('created_at', '<=', created_before);
    }
    
    // Apply sorting
    query = query.orderBy(sortBy, sortOrder);
    
    // Apply pagination
    query = query.limit(limit).offset(offset);
    
    return await query;
  }

  // Advanced content search
  static async searchContent(filters = {}, options = {}) {
    const { title, body, category, is_published } = filters;
    const { limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'desc' } = options;
    
    let query = db('content').select('*');
    
    if (title) {
      query = query.where('title', 'like', `%${title}%`);
    }
    
    if (body) {
      query = query.where('body', 'like', `%${body}%`);
    }
    
    if (category) {
      query = query.where('category', 'like', `%${category}%`);
    }
    
    if (is_published !== undefined) {
      query = query.where('is_published', is_published);
    }
    
    return await query.orderBy(sortBy, sortOrder).limit(limit).offset(offset);
  }

  // Advanced feed posts search
  static async searchFeedPosts(filters = {}, options = {}) {
    const { title, content, category, is_published } = filters;
    const { limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'desc' } = options;
    
    let query = db('feed_posts').select('*');
    
    if (title) {
      query = query.where('title', 'like', `%${title}%`);
    }
    
    if (content) {
      query = query.where('content', 'like', `%${content}%`);
    }
    
    if (category) {
      query = query.where('category', 'like', `%${category}%`);
    }
    
    if (is_published !== undefined) {
      query = query.where('is_published', is_published);
    }
    
    return await query.orderBy(sortBy, sortOrder).limit(limit).offset(offset);
  }

  // Advanced interview resources search
  static async searchInterviewResources(filters = {}, options = {}) {
    const { title, description, category, resource_type } = filters;
    const { limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'desc' } = options;
    
    let query = db('interview_resources').select('*');
    
    if (title) {
      query = query.where('title', 'like', `%${title}%`);
    }
    
    if (description) {
      query = query.where('description', 'like', `%${description}%`);
    }
    
    if (category) {
      query = query.where('category', 'like', `%${category}%`);
    }
    
    if (resource_type) {
      query = query.where('resource_type', resource_type);
    }
    
    return await query.orderBy(sortBy, sortOrder).limit(limit).offset(offset);
  }

  // Advanced clients search
  static async searchClients(filters = {}, options = {}) {
    const { name, category, industry, location } = filters;
    const { limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'desc' } = options;
    
    let query = db('clients').select('*');
    
    if (name) {
      query = query.where('name', 'like', `%${name}%`);
    }
    
    if (category) {
      query = query.where('category', 'like', `%${category}%`);
    }
    
    if (industry) {
      query = query.where('industry', 'like', `%${industry}%`);
    }
    
    if (location) {
      query = query.where('location', 'like', `%${location}%`);
    }
    
    return await query.orderBy(sortBy, sortOrder).limit(limit).offset(offset);
  }

  // Advanced users search (admin only)
  static async searchUsers(filters = {}, options = {}) {
    const { name, email, role, is_active } = filters;
    const { limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'desc' } = options;
    
    let query = db('users').select('id', 'name', 'email', 'role', 'is_active', 'created_at');
    
    if (name) {
      query = query.where('name', 'like', `%${name}%`);
    }
    
    if (email) {
      query = query.where('email', 'like', `%${email}%`);
    }
    
    if (role) {
      query = query.where('role', role);
    }
    
    if (is_active !== undefined) {
      query = query.where('is_active', is_active);
    }
    
    return await query.orderBy(sortBy, sortOrder).limit(limit).offset(offset);
  }

  // Get search suggestions for autocomplete
  static async getSearchSuggestions(query, table, field = 'title', limit = 5) {
    if (!query || !table) return [];
    
    const suggestions = await db(table)
      .select(field)
      .where(field, 'like', `%${query}%`)
      .distinct()
      .limit(limit);
    
    return suggestions.map(s => s[field]).filter(Boolean);
  }

  // Get search filters and options
  static async getSearchFilters(table) {
    switch (table) {
      case 'jobs':
        return {
          job_types: await this.getDistinctValues('jobs', 'job_type'),
          experience_levels: await this.getDistinctValues('jobs', 'experience_level'),
          categories: await this.getDistinctValues('jobs', 'category'),
          locations: await this.getDistinctValues('jobs', 'location'),
          companies: await this.getDistinctValues('jobs', 'company')
        };
      case 'content':
        return {
          categories: await this.getDistinctValues('content', 'category')
        };
      case 'feed_posts':
        return {
          categories: await this.getDistinctValues('feed_posts', 'category')
        };
      case 'interview_resources':
        return {
          categories: await this.getDistinctValues('interview_resources', 'category'),
          resource_types: await this.getDistinctValues('interview_resources', 'resource_type')
        };
      case 'clients':
        return {
          categories: await this.getDistinctValues('clients', 'category'),
          industries: await this.getDistinctValues('clients', 'industry'),
          locations: await this.getDistinctValues('clients', 'location')
        };
      default:
        return {};
    }
  }

  // Get distinct values for a column
  static async getDistinctValues(table, column) {
    const results = await db(table)
      .select(column)
      .distinct()
      .whereNotNull(column)
      .where(column, '!=', '');
    
    return results.map(r => r[column]).sort();
  }

  // Get search statistics
  static async getSearchStats(query) {
    const results = await this.globalSearch(query, { limit: 1000 });
    
    const stats = {};
    Object.keys(results).forEach(table => {
      stats[table] = results[table].length;
    });
    
    return {
      query,
      total_results: Object.values(stats).reduce((sum, count) => sum + count, 0),
      by_table: stats
    };
  }

  // Full-text search (if SQLite FTS is enabled)
  static async fullTextSearch(query, table, options = {}) {
    const { limit = 20, offset = 0 } = options;
    
    // This would require SQLite FTS tables to be set up
    // For now, fall back to LIKE search
    return await this.globalSearch(query, { limit, offset, tables: [table] });
  }
}

module.exports = SearchService; 