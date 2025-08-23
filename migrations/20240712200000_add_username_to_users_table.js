exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('username').unique(); // nullable for now
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('username');
  });
}; 