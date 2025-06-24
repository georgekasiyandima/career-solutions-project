exports.seed = async function (knex) {
  await knex('feed_posts').del();

  await knex('feed_posts').insert([
    {
      type: 'job',
      content: 'New Cruise Ship Bartender role posted! Check it out and apply today.',
      link: '/jobs/1',
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      type: 'motivation',
      content: 'Keep pushing—your dream job is closer than you think! Stay consistent and believe in yourself.',
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      type: 'tip',
      content: 'Tailor your resume for each job application to stand out. Highlight relevant skills!',
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      type: 'update',
      content: 'Now offering Visa Application Assistance—book a consultation to get started!',
      link: '/booking',
      created_at: new Date().toISOString(),
      is_active: true
    }
  ]);
};