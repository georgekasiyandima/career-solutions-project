exports.seed = function(knex) {
  return knex('enquiries').del()
    .then(function () {
      return knex('enquiries').insert([
        {
          first_name: 'Sarah',
          last_name: 'M.',
          email: 'sarah.m@email.com',
          phone: '+27-82-123-4567',
          message: 'Hi, I\'m interested in working on cruise ships. I have 3 years of experience as a waitress and I\'m looking for international opportunities. Can you help me with the application process and what positions are available?',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          first_name: 'David',
          last_name: 'K.',
          email: 'david.k@email.com',
          phone: '+27-83-234-5678',
          message: 'I\'m a construction worker with 8 years experience. I\'ve been unemployed for 8 months and I\'m looking for opportunities in the UK. Do you help with visa applications and job placement?',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          first_name: 'Lisa',
          last_name: 'K.',
          email: 'lisa.k@email.com',
          phone: '+27-84-345-6789',
          message: 'I\'m a marketing professional with 5 years experience. I\'m interested in working in Europe, particularly Germany or the Netherlands. What services do you offer for overseas job placement?',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          first_name: 'Michael',
          last_name: 'T.',
          email: 'michael.t@email.com',
          phone: '+27-85-456-7890',
          message: 'I have an interview for a Product Manager position at a tech company next week. I need help with interview preparation, especially behavioral questions. Do you offer coaching sessions?',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          first_name: 'Thabo',
          last_name: 'M.',
          email: 'thabo.m@email.com',
          phone: '+27-86-567-8901',
          message: 'I\'m a musician and I\'m interested in working on cruise ships. I play guitar and sing. What opportunities are available and what\'s the application process like?',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          first_name: 'Nokuthula',
          last_name: 'P.',
          email: 'nokuthula.p@email.com',
          phone: '+27-87-678-9012',
          message: 'I work in hospitality and I\'m interested in opportunities in Dubai. What\'s the visa process like and what positions are typically available?',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          first_name: 'James',
          last_name: 'B.',
          email: 'james.b@email.com',
          phone: '+27-88-789-0123',
          message: 'I\'m an IT professional with 7 years experience. I\'m interested in migrating to Australia. Can you help with the skilled migration process and job placement?',
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          first_name: 'Zinhle',
          last_name: 'N.',
          email: 'zinhle.n@email.com',
          phone: '+27-89-890-1234',
          message: 'I\'m a qualified spa therapist with 5 years experience. I\'m interested in working on cruise ships. What certifications do I need and how do I apply?',
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          first_name: 'Sipho',
          last_name: 'D.',
          email: 'sipho.d@email.com',
          phone: '+27-90-901-2345',
          message: 'I need help updating my resume for international job applications. I have experience in finance and I\'m looking for opportunities in the UK or Canada. What services do you offer?',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          first_name: 'Amanda',
          last_name: 'R.',
          email: 'amanda.r@email.com',
          phone: '+27-91-012-3456',
          message: 'I have a job offer in the UK but I need help with the visa application process. The company is sponsoring me but I need guidance on documentation and requirements.',
          created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    });
}; 