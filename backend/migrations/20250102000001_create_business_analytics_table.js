exports.up = function(knex) {
  return knex.schema.createTable('business_analytics', function(table) {
    table.increments('id').primary();
    
    // Service Analytics
    table.string('service_id').nullable();
    table.string('service_name').nullable();
    table.string('service_category').nullable(); // resume, visa, cover-letter
    
    // Client Demographics
    table.string('country_of_origin').nullable();
    table.string('client_email').nullable();
    table.string('age_range').nullable(); // 18-25, 26-35, etc.
    table.string('gender').nullable();
    
    // Business Metrics
    table.string('enquiry_type').nullable(); // initial_enquiry, service_selected, payment_made, service_completed
    table.string('conversion_stage').nullable(); // enquiry, selection, payment, completion
    table.boolean('converted').defaultTo(false);
    table.decimal('revenue', 10, 2).nullable();
    
    // Role/Position Data
    table.string('target_role').nullable();
    table.string('target_industry').nullable();
    table.string('target_country').nullable();
    
    // Source Tracking
    table.string('source').nullable(); // website, social_media, referral, etc.
    table.string('referral_source').nullable();
    table.string('campaign').nullable();
    
    // Timestamps
    table.timestamp('event_date').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('service_id');
    table.index('service_category');
    table.index('country_of_origin');
    table.index('conversion_stage');
    table.index('event_date');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('business_analytics');
};

