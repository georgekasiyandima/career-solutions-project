exports.up = function(knex) {
  return knex.schema.createTable('payments', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('service_id').unsigned().references('id').inTable('services').onDelete('CASCADE');
    table.decimal('amount', 10, 2).notNullable();
    table.timestamp('paid_at').defaultTo(knex.fn.now());
    table.string('status').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('payments');
}; 