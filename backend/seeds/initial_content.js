exports.seed = function(knex) {
  return knex('content').del()
    .then(function () {
      return knex('content').insert([
        {
          title: 'About Career Solutions',
          body: 'Career Solutions is dedicated to helping you achieve your career goals.',
          type: 'about',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          title: 'Our Mission',
          body: 'To empower job seekers with the best tools and support.',
          type: 'mission',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    });
} 