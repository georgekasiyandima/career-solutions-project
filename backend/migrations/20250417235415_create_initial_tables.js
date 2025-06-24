exports.up = function (knex) {
    return Promise.all([
      // Create bookings table
      knex.schema.createTable('bookings', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('service_type').notNullable();
        table.text('details');
      }),

      // Create enquiries table
      knex.schema.createTable('enquiries', (table) => {
        table.increments('id').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('phone_number').notNullable();
        table.string('email').notNullable();
        table.string('reason').notNullable();
        table.text('message');
      }),

      // Create subscriptions table
      knex.schema.createTable('subscriptions', (table) => {
        table.increments('id').primary();
        table.string('email').notNullable().unique();
      }),
    ]);
  };

  exports.down = function (knex) {
    return Promise.all([
      knex.schema.dropTableIfExists('bookings'),
      knex.schema.dropTableIfExists('enquiries'),
      knex.schema.dropTableIfExists('subscriptions'),
    ]);
  };