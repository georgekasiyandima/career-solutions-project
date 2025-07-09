const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        { first_name: 'Douglas', last_name: 'Chikwira', email: 'douglaschikwira@gmail.com', password_hash: '$2b$10$testhash', created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { first_name: 'Nathanie', last_name: 'Meke', email: 'nathanielmeke34@gmail.com', password_hash: '$2b$10$testhash', created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString() },
        { first_name: 'Yolanda', last_name: 'Jambo', email: 'yolandajambo34@gmail.com', password_hash: '$2b$10$testhash', created_at: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString() },
        { first_name: 'Daniel', last_name: 'Majuru', email: 'danielmajuru45@gmail.com', password_hash: '$2b$10$testhash', created_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString() },
        { first_name: 'Tinashe', last_name: 'Mpunga', email: 'tinashempunga@gmail.com', password_hash: '$2b$10$testhash', created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString() },
        { first_name: 'Thilda', last_name: 'Mutsago', email: 'thildamutsago34@gmail.com', password_hash: '$2b$10$testhash', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
        { first_name: 'Sharleen', last_name: 'Nziradzarwo', email: 'sharleennzira34@gmail.com', password_hash: '$2b$10$testhash', created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },
        { first_name: 'Ernest', last_name: 'Chikwira', email: 'ernestchikwira23@gmail.com', password_hash: '$2b$10$testhash', created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString() },
        { first_name: 'Lekhuthaba', last_name: 'Moyo', email: 'lekhuthabamoyo@email.com', password_hash: '$2b$10$testhash', created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
        { first_name: 'Leo', last_name: 'Karume', email: 'leokarume@email.com', password_hash: '$2b$10$testhash', created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() }
      ]);
    });
}; 