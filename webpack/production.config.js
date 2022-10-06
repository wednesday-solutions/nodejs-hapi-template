// Important modules this config uses
const path = require('path');

module.exports = require('./server.config')({
  mode: 'production',
  entry: [path.join(process.cwd(), './server.js')],

  plugins: [],
});
