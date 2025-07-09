exports.up = function(knex) {
  return knex.schema.createTable('success_stories', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').nullable();
    table.string('title');
    table.text('story');
    table.string('image_url');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('success_stories');
}; 