require("dotenv").config();
const db = require('./database');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await db('users')
      .where({ username: 'admin' })
      .orWhere({ email: 'admin@careersolutions.com' })
      .first();

    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash('admin123', saltRounds);

    // Create admin user
    const [adminUser] = await db('users')
      .insert({
        username: 'admin',
        email: 'admin@careersolutions.com',
        password_hash,
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        is_active: true,
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning(['id', 'username', 'email', 'first_name', 'last_name', 'role']);

    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('User details:', adminUser);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser(); 