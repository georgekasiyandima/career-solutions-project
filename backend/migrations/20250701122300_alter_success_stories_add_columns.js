exports.up = function(knex) {
  return knex.schema.table('success_stories', function(table) {
    table.string('name');
    table.string('role');
    table.string('company');
    table.text('testimonial');
    table.string('photo_url');
    table.timestamp('hired_date');
    table.boolean('is_active').defaultTo(true);
  });
};

exports.down = function(knex) {
  return knex.schema.table('success_stories', function(table) {
    table.dropColumn('name');
    table.dropColumn('role');
    table.dropColumn('company');
    table.dropColumn('testimonial');
    table.dropColumn('photo_url');
    table.dropColumn('hired_date');
    table.dropColumn('is_active');
  });
}; 