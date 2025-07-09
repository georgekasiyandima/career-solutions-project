exports.up = function(knex) {
  return knex.schema.createTable('user_services', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('service_id').unsigned().references('id').inTable('services').onDelete('CASCADE');
    table.timestamp('provided_at').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_services');
}; 