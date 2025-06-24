const bcrypt = require('bcryptjs');

const storedHash = '$2b$10$CW3jJG96cvk7LHfbxTIuvuZiOxTvBd3SzT/O2lBrHMoJW5G8bWQqK';
const password = 'admin123';

bcrypt.compare(password, storedHash).then((isMatch) => {
  console.log('Does the password match the hash?', isMatch);
});