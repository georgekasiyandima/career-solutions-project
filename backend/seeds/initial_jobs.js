exports.seed = async function (knex) {
  await knex('jobs').del();

  await knex('jobs').insert([
    {
      id: 1,
      title: 'Cruise Ship Bartender',
      company: 'Royal Caribbean',
      location: 'Global',
      description: 'Serve drinks on luxury cruises, ensuring a great guest experience. Requires excellent customer service skills and experience in bartending.',
      job_type: 'Contract',
      category: 'Cruise Jobs',
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: 2,
      title: 'Construction Manager',
      company: 'Global Builders',
      location: 'Dubai, UAE',
      description: 'Oversee construction projects overseas, managing teams and ensuring timely completion. Requires 5+ years of experience.',
      job_type: 'Full-time',
      category: 'Land Jobs',
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: 3,
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'London, UK',
      description: 'Develop and maintain web applications for a leading tech firm. Requires proficiency in JavaScript and React.',
      job_type: 'Full-time',
      category: 'IT',
      created_at: new Date().toISOString(),
      is_active: true
    }
  ]);
};