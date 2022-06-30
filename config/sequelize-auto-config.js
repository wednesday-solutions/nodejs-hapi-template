const SequelizeAuto = require('sequelize-auto');

// Edit your database settings in config object
const config = {
    database: 'temp_dev',
    user: 'root',
    pass: 'password',
    autoOptions: {
        caseProp: 'c',
        port: 3306,
        host: 'localhost',
        directory: './lib/models',
        dialect: 'mysql',
        additional: { timestamps: false },
        skipTables: ['SequelizeMeta', 'SequelizeMetaBackup']
    }
};

var auto = new SequelizeAuto(
    config.database,
    config.user,
    config.pass,
    config.autoOptions
);

auto.run().then(data => {
    // const tableNames = Object.keys(data.tables);
    // table list
    // console.log(tableNames);
    // console.log(data.foreignKeys); // foreign key list
    // console.log(data.text)         // text of generated files
});
