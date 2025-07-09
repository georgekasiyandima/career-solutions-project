exports.up = function(knex) {
  return knex.schema.createTable('enquiries', function(table) {
    table.increments('id').primary();
    table.string('first_name');
    table.string('last_name');
    table.string('email');
    table.string('phone');
    table.text('message');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('enquiries');
}; 