const knex = require('knex');
const knexfile = require('../knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

const db = knex(config);

// Test database connection
const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Run migrations
    await db.migrate.latest();
    console.log('✅ Database migrations completed');
    
    // Run seeds in development
    if (environment === 'development') {
      await db.seed.run();
      console.log('✅ Database seeds completed');
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

module.exports = {
  db,
  testConnection,
  initializeDatabase
}; 