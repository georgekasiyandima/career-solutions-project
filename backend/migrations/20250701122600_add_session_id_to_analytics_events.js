exports.up = function(knex) {
  return knex.schema.table('analytics_events', function(table) {
    table.string('session_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('analytics_events', function(table) {
    table.dropColumn('session_id');
  });
}; 