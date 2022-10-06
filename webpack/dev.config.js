/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

module.exports = require('./server.config')({
  mode: 'development',
  // Add hot reloading in development
  entry: [
    path.join(process.cwd(), './server.js'),
  ],
  // Don't use hashes in dev mode for better performance

  // Add development plugins
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
  ],
});
