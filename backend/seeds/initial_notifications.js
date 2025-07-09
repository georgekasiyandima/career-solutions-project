exports.seed = function(knex) {
  return knex('notifications').del()
    .then(function () {
      return knex('notifications').insert([
        {
          user_id: 1,
          title: 'Welcome!',
          message: 'Thank you for joining Career Solutions.',
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: 1,
          title: 'Booking Confirmed',
          message: 'Your booking for Resume Review is confirmed.',
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    });
} 