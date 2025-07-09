exports.seed = function(knex) {
  return knex('job_sends').del()
    .then(function () {
      return knex('job_sends').insert([
        {
          user_id: 1,
          job_title: 'Software Engineer',
          company: 'Tech Innovators',
          status: 'sent',
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: 1,
          job_title: 'Project Manager',
          company: 'Global Talent',
          status: 'pending',
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    });
} 