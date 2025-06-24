exports.up = function (knex) {
    return knex.schema.createTable('jobs', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('company').notNullable();
      table.string('location').notNullable();
      table.text('description').notNullable();
      table.string('job_type').notNullable(); // e.g., Full-time, Part-time
      table.string('category').notNullable(); // e.g., IT, Marketing
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.boolean('is_active').defaultTo(true);
    });
  };

  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('jobs');
  };
