exports.up = function(knex) {
  return knex.schema.createTable('feed_posts', function(table) {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('content');
    table.integer('author_id').unsigned().references('id').inTable('users');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('feed_posts');
}; 