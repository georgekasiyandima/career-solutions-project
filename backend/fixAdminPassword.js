require("dotenv").config();
const db = require('./database');
const bcrypt = require('bcryptjs');

async function fixAdminPassword() {
  try {
    // Find admin user
    const adminUser = await db('users')
      .where({ email: 'admin@careersolutions.com' })
      .first();

    if (!adminUser) {
      console.log('Admin user not found. Creating...');
      // Get admin role ID
      const adminRole = await db('roles').where({ name: 'admin' }).first();
      if (!adminRole) {
        console.error('Admin role not found!');
        process.exit(1);
      }

      // Hash the password
      const password_hash = await bcrypt.hash('admin123', 10);

      // Create admin user
      await db('users').insert({
        email: 'admin@careersolutions.com',
        password_hash,
        first_name: 'Admin',
        last_name: 'User',
        role_id: adminRole.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      console.log('Admin user created successfully!');
    } else {
      console.log('Admin user found. Updating password...');
      
      // Test current password
      const isValid = await bcrypt.compare('admin123', adminUser.password_hash);
      
      if (!isValid) {
        // Update password
        const password_hash = await bcrypt.hash('admin123', 10);
        await db('users')
          .where({ id: adminUser.id })
          .update({ password_hash, updated_at: new Date().toISOString() });
        
        console.log('Password updated successfully!');
      } else {
        console.log('Password is already correct.');
      }

      // Ensure role_id is set
      const adminRole = await db('roles').where({ name: 'admin' }).first();
      if (adminRole && adminUser.role_id !== adminRole.id) {
        await db('users')
          .where({ id: adminUser.id })
          .update({ role_id: adminRole.id });
        console.log('Role ID updated to', adminRole.id);
      }
    }

    console.log('\nAdmin credentials:');
    console.log('Email: admin@careersolutions.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error fixing admin password:', error);
  } finally {
    process.exit(0);
  }
}

fixAdminPassword();




