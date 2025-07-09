exports.up = function(knex) {
  return knex.schema.createTable('tracking_events', function(table) {
    table.increments('id').primary();
    table.string('event_type').notNullable();
    table.text('event_data');
    table.string('user_ip');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tracking_events');
}; 