exports.up = function(knex) {
  return knex.schema.createTable('job_sends', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.string('job_title');
    table.string('company');
    table.string('status');
    table.timestamp('sent_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('job_sends');
}; 