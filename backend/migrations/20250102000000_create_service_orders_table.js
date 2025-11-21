exports.up = function(knex) {
  return knex.schema.createTable('service_orders', function(table) {
    table.increments('id').primary();
    table.string('order_number').unique().notNullable();
    table.string('service_id').notNullable();
    table.string('service_name').notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.string('status').defaultTo('pending'); // pending, paid, processing, completed, cancelled
    table.string('payment_status').defaultTo('pending'); // pending, paid, failed, refunded
    table.string('payment_method').nullable();
    table.string('payment_reference').nullable();
    
    // Client Information
    table.string('client_name').notNullable();
    table.string('client_email').notNullable();
    table.string('client_phone').notNullable();
    table.string('client_country').nullable();
    
    // Service-specific data (JSON)
    table.json('service_data').nullable(); // For visa details, resume type, etc.
    
    // Analytics fields
    table.string('source').nullable(); // website, referral, social media, etc.
    table.string('demographics').nullable(); // JSON for demographics data
    
    // Timestamps
    table.timestamp('paid_at').nullable();
    table.timestamp('completed_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('order_number');
    table.index('client_email');
    table.index('status');
    table.index('payment_status');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('service_orders');
};

