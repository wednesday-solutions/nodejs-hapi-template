const mysql2 = require('mysql2');

module.exports = {
  url:
    process.env.DB_URI ||
    `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`,
  host: process.env.MYSQL_HOST,
  dialectModule: mysql2,
  dialect: 'mysql',
  pool: {
    min: 0,
    max: 10,
    idle: 10000,
  },
  define: {
    underscored: true,
    timestamps: false,
  },
};
