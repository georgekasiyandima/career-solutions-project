exports.up = function(knex) {
  return knex.schema.table('analytics_events', function(table) {
    table.text('event_data');
  });
};

exports.down = function(knex) {
  return knex.schema.table('analytics_events', function(table) {
    table.dropColumn('event_data');
  });
}; 