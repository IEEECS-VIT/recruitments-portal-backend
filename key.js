const crypto = require('crypto');

function generateRandomKey(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

const randomKey = generateRandomKey(32); // Generate a 32-character random key
console.log(randomKey);
