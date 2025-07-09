exports.seed = function(knex) {
  return knex('roles').del()
    .then(function () {
      return knex('roles').insert([
        { id: 1, name: 'admin', description: 'Administrator' },
        { id: 2, name: 'user', description: 'Standard User' }
      ]);
    });
}; 