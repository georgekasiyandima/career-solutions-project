exports.up = function (knex) {
    return knex.schema.createTable('tracking_events', (table) => {
      table.increments('id').primary();
      table.string('event_type').notNullable(); // e.g., page_view, job_view, form_submission
      table.string('event_data'); // JSON string, e.g., { "path": "/jobs/1" }
      table.string('user_ip'); // Optional, for basic user identification
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tracking_events');
  };
