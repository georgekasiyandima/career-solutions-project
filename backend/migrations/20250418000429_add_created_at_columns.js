exports.up = function (knex) {
    return Promise.all([
      knex.schema.table('bookings', (table) => {
        table.timestamp('created_at').defaultTo(knex.fn.now());
      }),
      knex.schema.table('enquiries', (table) => {
        table.timestamp('created_at').defaultTo(knex.fn.now());
      }),
      knex.schema.table('subscriptions', (table) => {
        table.timestamp('created_at').defaultTo(knex.fn.now());
      }),
    ]);
  };

  exports.down = function (knex) {
    return Promise.all([
      knex.schema.table('bookings', (table) => {
        table.dropColumn('created_at');
      }),
      knex.schema.table('enquiries', (table) => {
        table.dropColumn('created_at');
      }),
      knex.schema.table('subscriptions', (table) => {
        table.dropColumn('created_at');
      }),
    ]);
  };