exports.seed = async function (knex) {
  await knex('success_stories').del();

  await knex('success_stories').insert([
    {
      name: 'Nathaniel Meke',
      role: 'Assistant Waiter',
      company: 'Cunard Cruise Line',
      testimonial: 'Thanks to Career Solutions, I landed my dream job on a cruise ship! The guidance on my resume and interview prep was invaluable.',
      photo_url: '/images/Nathaniel.jpg',
      hired_date: '2024-12-01',
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      name: 'Thildah Mutsago',
      role: 'Housekeeper',
      company: 'Princess Cruise Line',
      testimonial: 'I never thought I’d get a cruise ship job, but Career Solutions made it happen. Their support gave me the confidence to succeed.',
      photo_url: '/images/Thildah1.jpg',
      hired_date: '2024-11-15',
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      name: 'Daniel Majuru',
      role: 'HVG Driver',
      company: 'JMS Haulage',
      testimonial: 'The personalized advice on job applications was a game-changer. I’m now working in my dream role!',
      photo_url: '/images/Daniel.jpg',
      hired_date: '2025-03-20',
      created_at: new Date().toISOString(),
      is_active: true
    }
  ]);
};
