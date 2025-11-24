exports.up = function(knex) {
  return knex.schema.createTable('testimonials_metrics', function(table) {
    table.increments('id').primary();
    
    // Client Information
    table.string('client_name').notNullable();
    table.string('client_email').nullable();
    table.string('client_phone').nullable();
    table.string('client_country').nullable();
    
    // Service Information
    table.string('service_type').nullable(); // resume, visa, cover-letter, package
    table.string('service_id').nullable(); // Reference to service order
    
    // Interview & Offer Metrics
    table.integer('interviews_granted').defaultTo(0);
    table.integer('offers_received').defaultTo(0);
    table.integer('offers_accepted').defaultTo(0);
    table.boolean('onboarded').defaultTo(false);
    table.timestamp('onboarding_date').nullable();
    
    // Job Details
    table.string('job_title').nullable();
    table.string('company_name').nullable();
    table.string('job_location').nullable();
    table.string('job_country').nullable();
    table.decimal('salary_offered', 12, 2).nullable();
    table.string('currency').defaultTo('ZAR');
    
    // Timeline
    table.timestamp('service_completed_date').nullable();
    table.timestamp('first_interview_date').nullable();
    table.timestamp('offer_received_date').nullable();
    table.timestamp('start_date').nullable();
    
    // Testimonial Content
    table.text('testimonial').nullable();
    table.integer('rating').nullable(); // 1-5 stars
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_approved').defaultTo(false);
    table.string('photo_url').nullable();
    
    // Additional Metrics
    table.integer('days_to_first_interview').nullable();
    table.integer('days_to_offer').nullable();
    table.integer('days_to_onboarding').nullable();
    table.decimal('success_score', 5, 2).nullable(); // Calculated success metric
    
    // Status
    table.string('status').defaultTo('pending'); // pending, active, completed, archived
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('status');
    table.index('is_featured');
    table.index('is_approved');
    table.index('service_type');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('testimonials_metrics');
};
