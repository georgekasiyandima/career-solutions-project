exports.up = function(knex) {
  return knex.schema.createTable('content', function(table) {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('body');
    table.string('type');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('content');
}; 