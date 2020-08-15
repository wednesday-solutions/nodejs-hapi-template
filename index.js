// Run all scripts with ESM syntax support.
require('dotenv').config();
module.exports = require('esm')(module /* , options */)('./server.js'); // Start server
