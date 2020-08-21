module.exports = {
    development: {
        url: process.env.DB_URI,
        host: process.env.DB_HOST,
        logging: true,
        dialect: 'mysql',
        pool: {
            min: 0,
            max: 10,
            idle: 10000
        },
        define: {
            userscored: true,
            timestamps: false
        }
    }
};
