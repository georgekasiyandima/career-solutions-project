exports.up = function (knex) {
    return knex.schema.createTable('feed_posts', (table) => {
      table.increments('id').primary();
      table.string('type').notNullable(); // e.g., job, motivation, tip, success, update
      table.text('content').notNullable();
      table.string('link'); // Optional URL, e.g., /jobs/1
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.boolean('is_active').defaultTo(true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('feed_posts');
  };
