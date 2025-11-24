exports.up = function(knex) {
  return knex.schema.createTable('career_updates', function(table) {
    table.increments('id').primary();
    
    // Update Type
    table.string('type').notNullable(); // job_opportunity, company_hiring, recruitment_drive, career_link, internal_ad
    
    // Content
    table.string('title').notNullable();
    table.text('description').nullable();
    table.text('content').nullable(); // Rich content/HTML
    
    // Link Information
    table.string('link_url').nullable();
    table.string('link_text').nullable();
    table.boolean('is_external').defaultTo(true);
    
    // Company/Organization Info
    table.string('company_name').nullable();
    table.string('company_logo_url').nullable();
    table.string('location').nullable();
    table.string('country').nullable();
    
    // Job Details (if type is job_opportunity)
    table.string('job_title').nullable();
    table.string('job_type').nullable(); // full-time, part-time, contract
    table.string('salary_range').nullable();
    table.string('experience_level').nullable();
    table.text('requirements').nullable();
    table.date('application_deadline').nullable();
    
    // Recruitment Drive Details
    table.date('drive_start_date').nullable();
    table.date('drive_end_date').nullable();
    table.string('drive_location').nullable();
    
    // Media
    table.string('image_url').nullable();
    table.string('video_url').nullable();
    
    // Priority & Visibility
    table.integer('priority').defaultTo(0); // Higher number = higher priority
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_pinned').defaultTo(false);
    
    // Scheduling
    table.timestamp('publish_at').nullable(); // For scheduled posts
    table.timestamp('expires_at').nullable(); // Auto-expire
    
    // Analytics
    table.integer('views').defaultTo(0);
    table.integer('clicks').defaultTo(0);
    table.integer('applications').defaultTo(0);
    
    // Metadata
    table.json('metadata').nullable(); // Additional flexible data
    table.string('tags').nullable(); // Comma-separated tags
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('type');
    table.index('is_active');
    table.index('is_featured');
    table.index('is_pinned');
    table.index('publish_at');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('career_updates');
};

