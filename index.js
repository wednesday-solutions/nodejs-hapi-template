// Run all scripts with ESM syntax support.
require('utils/configureEnv')();
module.exports = require('esm')(module /* , options */)('./server.js'); // Start server
