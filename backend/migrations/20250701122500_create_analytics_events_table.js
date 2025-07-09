exports.up = function(knex) {
  return knex.schema.createTable('analytics_events', function(table) {
    table.increments('id').primary();
    table.string('event_type').notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users').nullable();
    table.string('page');
    table.text('metadata');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('analytics_events');
}; 