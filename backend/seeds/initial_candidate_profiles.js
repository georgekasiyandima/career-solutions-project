const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // 1. Add/Find Users
  const usersData = [
    {
      first_name: 'Monica', last_name: 'Chidhakwa', email: 'monicachidhakwa43@gmail.com', password_hash: '$2b$12$Gr0GbJbV5.SVrzvEcVxKYuY8FmiQE7J3tYh1iHY091yWepMSBxD9a', created_at: new Date(), updated_at: new Date()
    },
    {
      first_name: 'Mthabisi M.', last_name: 'Moyo', email: 'moyobongie59@gmail.com', password_hash: '$2b$12$Gr0GbJbV5.SVrzvEcVxKYuY8FmiQE7J3tYh1iHY091yWepMSBxD9a', created_at: new Date(), updated_at: new Date()
    },
    {
      first_name: 'Nelly Charity', last_name: 'Luthuli', email: 'neliemaneleza@gmail.com', password_hash: '$2b$12$Gr0GbJbV5.SVrzvEcVxKYuY8FmiQE7J3tYh1iHY091yWepMSBxD9a', created_at: new Date(), updated_at: new Date()
    },
    {
      first_name: 'Leo', last_name: 'Karume', email: 'karumeleo10@gmail.com', password_hash: '$2b$12$Gr0GbJbV5.SVrzvEcVxKYuY8FmiQE7J3tYh1iHY091yWepMSBxD9a', created_at: new Date(), updated_at: new Date()
    }
  ];

  // Insert users if not already present
  for (const user of usersData) {
    const existing = await knex('users').where({ email: user.email }).first();
    if (!existing) {
      await knex('users').insert(user);
    }
  }

  // Get user IDs
  const users = {};
  for (const user of usersData) {
    const dbUser = await knex('users').where({ email: user.email }).first();
    users[user.email] = dbUser.id;
  }

  // 2. Add Candidate Profiles
  const profilesData = [
    {
      user_id: users['monicachidhakwa43@gmail.com'],
      position: 'Laundry Attendant',
      gender: 'female',
      age_group: 'adult',
      country: 'South Africa',
      qualifications: 'High School Certificate',
      image_url: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: users['moyobongie59@gmail.com'],
      position: 'Cabin Steward',
      gender: 'male',
      age_group: 'adult',
      country: 'South Africa',
      qualifications: 'High School Certificate',
      image_url: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: users['neliemaneleza@gmail.com'],
      position: 'Waitress',
      gender: 'female',
      age_group: 'adult',
      country: 'South Africa',
      qualifications: 'Grade 12 Certificate',
      image_url: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: users['karumeleo10@gmail.com'],
      position: 'Sommelier',
      gender: 'male',
      age_group: 'adult',
      country: 'UAE',
      qualifications: 'High School Certificate, WSET Level 2',
      image_url: '',
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  for (const profile of profilesData) {
    const existing = await knex('candidate_profiles').where({ user_id: profile.user_id }).first();
    if (!existing) {
      await knex('candidate_profiles').insert(profile);
    }
  }

  // 3. Add Services
  const servicesData = [
    { name: 'Application on behalf for cruise ship jobs', description: 'We apply for cruise ship jobs on your behalf.', created_at: new Date(), updated_at: new Date() },
    { name: 'Full Package', description: 'Full package service for cruise ship job application.', created_at: new Date(), updated_at: new Date() }
  ];
  for (const service of servicesData) {
    const existing = await knex('services').where({ name: service.name }).first();
    if (!existing) {
      await knex('services').insert(service);
    }
  }
  // Get service IDs
  const services = {};
  for (const service of servicesData) {
    const dbService = await knex('services').where({ name: service.name }).first();
    services[service.name] = dbService.id;
  }

  // 4. Add User Services
  const userServicesData = [
    // Monica: Application on behalf
    { user_id: users['monicachidhakwa43@gmail.com'], service_id: services['Application on behalf for cruise ship jobs'], provided_at: new Date(), created_at: new Date(), updated_at: new Date() },
    // Mthabisi: Application on behalf
    { user_id: users['moyobongie59@gmail.com'], service_id: services['Application on behalf for cruise ship jobs'], provided_at: new Date(), created_at: new Date(), updated_at: new Date() },
    // Nelly: Full Package
    { user_id: users['neliemaneleza@gmail.com'], service_id: services['Full Package'], provided_at: new Date(), created_at: new Date(), updated_at: new Date() },
    // Leo: Application on behalf
    { user_id: users['karumeleo10@gmail.com'], service_id: services['Application on behalf for cruise ship jobs'], provided_at: new Date(), created_at: new Date(), updated_at: new Date() }
  ];
  for (const us of userServicesData) {
    await knex('user_services').insert(us);
  }

  // 5. Add Payments
  const paymentsData = [
    // Monica: paid for Application on behalf
    { user_id: users['monicachidhakwa43@gmail.com'], service_id: services['Application on behalf for cruise ship jobs'], amount: 500.00, paid_at: new Date(), status: 'successful', created_at: new Date(), updated_at: new Date() },
    // Nelly: paid for Full Package
    { user_id: users['neliemaneleza@gmail.com'], service_id: services['Full Package'], amount: 1000.00, paid_at: new Date(), status: 'successful', created_at: new Date(), updated_at: new Date() },
    // Leo: paid for Application on behalf
    { user_id: users['karumeleo10@gmail.com'], service_id: services['Application on behalf for cruise ship jobs'], amount: 500.00, paid_at: new Date(), status: 'successful', created_at: new Date(), updated_at: new Date() }
  ];
  for (const payment of paymentsData) {
    await knex('payments').insert(payment);
  }
}; 