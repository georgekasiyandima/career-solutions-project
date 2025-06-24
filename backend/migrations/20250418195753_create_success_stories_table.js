exports.up = function (knex) {
    return knex.schema.createTable('success_stories', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('role').notNullable();
      table.string('company').notNullable();
      table.text('testimonial').notNullable();
      table.string('photo_url'); // Optional URL to a photo
      table.date('hired_date').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.boolean('is_active').defaultTo(true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('success_stories');
  };
