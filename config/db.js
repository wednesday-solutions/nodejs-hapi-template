const mysql2 = require('mysql2');

module.exports = {
  url: process.env.DB_URI,
  host: process.env.MYSQL_HOST,
  dialectModule: mysql2,
  dialect: 'mysql',
  pool: {
    min: 0,
    max: 10,
    idle: 10000,
  },
  define: {
    userscored: true,
    timestamps: false,
  },
};
