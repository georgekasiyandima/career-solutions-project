exports.up = async function (knex) {
  // Update bookings table in place
  await knex.schema.table('bookings', (table) => {
    // Add name column as nullable
    table.string('name');
    // Make phone, date, time, and message nullable to match current requirements
    table.string('phone').nullable().alter();
    table.string('date').nullable().alter();
    table.string('time').nullable().alter();
    table.text('message').nullable().alter();
    // Ensure created_at is a string (if it was a timestamp before)
    table.string('created_at').notNullable().alter();
  });

  // Populate the name column by concatenating first_name and last_name
  await knex('bookings').update({
    name: knex.raw("COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')"),
  });

  // Finalize bookings table changes
  await knex.schema.table('bookings', (table) => {
    // Make name not nullable and drop first_name, last_name
    table.string('name').notNullable().alter();
    table.dropColumn('first_name');
    table.dropColumn('last_name');
    // Rename service to service_type
    table.renameColumn('service', 'service_type');
  });

  // Update enquiries table
  await knex.schema.table('enquiries', (table) => {
    // Rename phone_number to phone
    table.renameColumn('phone_number', 'phone');
    // Drop reason (not used by enquiries.js)
    table.dropColumn('reason');
  });
};

exports.down = async function (knex) {
  // Revert bookings table changes
  await knex.schema.table('bookings', (table) => {
    // Add back first_name and last_name
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
  });

  // Split name back into first_name and last_name
  await knex('bookings').update({
    first_name: knex.raw("SUBSTR(name, 1, INSTR(name, ' ') - 1)"),
    last_name: knex.raw("SUBSTR(name, INSTR(name, ' ') + 1)"),
  });

  // Finalize bookings table revert
  await knex.schema.table('bookings', (table) => {
    // Drop name and rename service_type back to service
    table.dropColumn('name');
    table.renameColumn('service_type', 'service');
    // Revert phone, date, time, message to not nullable (if they were originally)
    table.string('phone').notNullable().alter();
    table.string('date').notNullable().alter();
    table.string('time').notNullable().alter();
    table.text('message').notNullable().alter();
    // Revert created_at if needed (e.g., back to timestamp)
    table.timestamp('created_at').notNullable().alter();
  });

  // Revert enquiries table changes
  await knex.schema.table('enquiries', (table) => {
    table.renameColumn('phone', 'phone_number');
    // Add reason column as nullable first
    table.string('reason');
  });

  // Populate reason for existing rows
  await knex('enquiries').whereNull('reason').update({
    reason: 'Not specified',
  });

  // Enforce not nullable constraint on reason
  await knex.schema.table('enquiries', (table) => {
    table.string('reason').notNullable().alter();
  });
};