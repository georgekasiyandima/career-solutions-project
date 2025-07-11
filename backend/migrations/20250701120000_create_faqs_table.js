exports.up = function(knex) {
  return knex.schema.createTable('faqs', function(table) {
    table.increments('id').primary();
    table.string('question').notNullable();
    table.text('answer').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('faqs');
}; 