const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};
const SequelizeMock = require('sequelize-mock');
const dbConfig = require('config/db');

let sequelize;
if (process.env.NODE_ENV === 'test') {
    sequelize = new SequelizeMock();
} else {
    sequelize = new Sequelize(dbConfig.development.url, dbConfig.development);
}

fs.readdirSync(__dirname)
    .filter(
        file =>
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
    )
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
