const Parse = require('parse/node');

// Substitua suas credenciais abaixo:
Parse.initialize(
    '7KHUUlAqvUvsjds7YslmBLIPglpdSQYCDM0wPYSk',  // Application ID
    'l5hvrmdXHu2tG9YbLyhjdxM8Jzge1EkCrdVrnpBE'   // JavaScript Key
);
Parse.serverURL = 'https://parseapi.back4app.com';

module.exports = Parse;
