exports.up = function(knex) {
  return knex.schema.createTable('content_updates', function(table) {
    table.increments('id').primary();
    
    // Content Type
    table.string('content_type').notNullable(); // career_link, company_hiring, recruitment_drive, internal_ad, general_update
    table.string('title').notNullable();
    table.text('description').nullable();
    table.text('content').nullable(); // Full content/body
    
    // Link/URL Information
    table.string('url').nullable();
    table.string('link_text').nullable();
    
    // Company/Organization Details
    table.string('company_name').nullable();
    table.string('company_location').nullable();
    table.string('company_country').nullable();
    
    // Recruitment Drive Details
    table.timestamp('drive_start_date').nullable();
    table.timestamp('drive_end_date').nullable();
    table.string('positions_available').nullable(); // JSON array or comma-separated
    table.string('application_deadline').nullable();
    
    // Media
    table.string('image_url').nullable();
    table.string('video_url').nullable();
    
    // Priority & Visibility
    table.integer('priority').defaultTo(0); // Higher number = higher priority
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamp('publish_date').nullable();
    table.timestamp('expiry_date').nullable();
    
    // Analytics
    table.integer('views').defaultTo(0);
    table.integer('clicks').defaultTo(0);
    
    // Status
    table.string('status').defaultTo('draft'); // draft, published, archived
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('content_type');
    table.index('status');
    table.index('is_active');
    table.index('is_featured');
    table.index('publish_date');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('content_updates');
};





