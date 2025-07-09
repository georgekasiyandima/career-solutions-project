exports.seed = function(knex) {
  return knex('clients').del()
    .then(function () {
      return knex('clients').insert([
        { name: 'Royal Caribbean', email: 'info@royalcaribbean.com', phone: '+1 305 539 6000', company: 'Royal Caribbean', created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { name: 'Cunard', email: 'info@cunard.com', phone: '+44 23 8068 2280', company: 'Cunard', created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString() },
        { name: 'Carnival Cruise', email: 'info@carnival.com', phone: '+1 800 764 7419', company: 'Carnival Cruise', created_at: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString() },
        { name: 'Sean Carroll Trucks', email: 'info@seancarrolltrucks.ie', phone: '+353 1 234 5678', company: 'Sean Carroll Trucks', created_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString() },
        { name: 'Rosteka Trucks', email: 'info@rosteka.pl', phone: '+48 22 123 4567', company: 'Rosteka Trucks', created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString() },
        { name: 'Princcess Cruise Line', email: 'info@princess.com', phone: '+1 800 774 6237', company: 'Princcess Cruise Line', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
        { name: 'UAE', email: 'info@uae.com', phone: '+971 4 123 4567', company: 'UAE', created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },
        { name: 'Disney Cruise Lines', email: 'info@disneycruise.com', phone: '+1 800 951 3532', company: 'Disney Cruise Lines', created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString() }
      ]);
    });
}; 