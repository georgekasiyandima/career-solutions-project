exports.up = function(knex) {
  return knex.schema.createTable('candidate_profiles', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('position');
    table.string('gender');
    table.string('age_group');
    table.string('country');
    table.string('qualifications');
    table.string('image_url');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('candidate_profiles');
}; 