exports.up = function(knex) {
  return knex.schema.createTable('interview_resources', function(table) {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('type');
    table.string('category');
    table.string('tags');
    table.text('content');
    table.boolean('is_published').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('interview_resources');
}; 