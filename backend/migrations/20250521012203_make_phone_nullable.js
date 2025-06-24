exports.up = async function (knex) {
    // Step 1: Create a new table with the corrected schema (phone nullable)
    await knex.schema.createTable('bookings_new', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('phone'); // Nullable
      table.string('service_type').notNullable();
      table.string('date');
      table.string('time');
      table.text('message');
      table.string('created_at').notNullable();
    });
  
    // Step 2: Copy data from the old table to the new table
    await knex('bookings_new').insert(
      knex.select(
        'id',
        'name',
        'email',
        'phone',
        'service_type',
        'date',
        'time',
        'message',
        'created_at'
      ).from('bookings')
    );
  
    // Step 3: Drop the old table
    await knex.schema.dropTable('bookings');
  
    // Step 4: Rename the new table to bookings
    await knex.schema.renameTable('bookings_new', 'bookings');
  };
  
  exports.down = async function (knex) {
    // Step 1: Create a new table with the original schema (phone not nullable)
    await knex.schema.createTable('bookings_new', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('phone').notNullable();
      table.string('service_type').notNullable();
      table.string('date');
      table.string('time');
      table.text('message');
      table.string('created_at').notNullable();
    });
  
    // Step 2: Copy data from the current table to the new table
    await knex('bookings_new').insert(
      knex.select(
        'id',
        'name',
        'email',
        knex.raw('COALESCE(phone, "Unknown") as phone'), // Provide a default value for NULL phone entries
        'service_type',
        'date',
        'time',
        'message',
        'created_at'
      ).from('bookings')
    );
  
    // Step 3: Drop the current table
    await knex.schema.dropTable('bookings');
  
    // Step 4: Rename the new table to bookings
    await knex.schema.renameTable('bookings_new', 'bookings');
  };
