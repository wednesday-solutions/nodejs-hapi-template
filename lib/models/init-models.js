var DataTypes = require('sequelize').DataTypes;
var _bookings = require('./bookings');
var _cabs = require('./cabs');
var _drivers = require('./drivers');
var _oauth_access_tokens = require('./oauth_access_tokens');
var _oauth_client_resources = require('./oauth_client_resources');
var _oauth_client_scopes = require('./oauth_client_scopes');
var _oauth_clients = require('./oauth_clients');
var _users = require('./users');

function initModels(sequelize) {
    var bookings = _bookings(sequelize, DataTypes);
    var cabs = _cabs(sequelize, DataTypes);
    var drivers = _drivers(sequelize, DataTypes);
    var oauth_access_tokens = _oauth_access_tokens(sequelize, DataTypes);
    var oauth_client_resources = _oauth_client_resources(sequelize, DataTypes);
    var oauth_client_scopes = _oauth_client_scopes(sequelize, DataTypes);
    var oauth_clients = _oauth_clients(sequelize, DataTypes);
    var users = _users(sequelize, DataTypes);

    bookings.belongsTo(cabs, { as: 'cab', foreignKey: 'cabId' });
    cabs.hasMany(bookings, { as: 'bookings', foreignKey: 'cabId' });
    drivers.belongsTo(cabs, { as: 'cab', foreignKey: 'cabId' });
    cabs.hasMany(drivers, { as: 'drivers', foreignKey: 'cabId' });
    bookings.belongsTo(drivers, { as: 'driver', foreignKey: 'driverId' });
    drivers.hasMany(bookings, { as: 'bookings', foreignKey: 'driverId' });
    oauth_access_tokens.belongsTo(oauth_clients, {
        as: 'oauthClient',
        foreignKey: 'oauthClientId'
    });
    oauth_clients.hasMany(oauth_access_tokens, {
        as: 'oauthAccessTokens',
        foreignKey: 'oauthClientId'
    });
    oauth_client_resources.belongsTo(oauth_clients, {
        as: 'oauthClient',
        foreignKey: 'oauthClientId'
    });
    oauth_clients.hasMany(oauth_client_resources, {
        as: 'oauthClientResources',
        foreignKey: 'oauthClientId'
    });
    oauth_client_scopes.belongsTo(oauth_clients, {
        as: 'oauthClient',
        foreignKey: 'oauthClientId'
    });
    oauth_clients.hasOne(oauth_client_scopes, {
        as: 'oauthClientScope',
        foreignKey: 'oauthClientId'
    });
    users.belongsTo(oauth_clients, {
        as: 'oauthClient',
        foreignKey: 'oauthClientId'
    });
    oauth_clients.hasMany(users, { as: 'users', foreignKey: 'oauthClientId' });
    bookings.belongsTo(users, { as: 'user', foreignKey: 'userId' });
    users.hasMany(bookings, { as: 'bookings', foreignKey: 'userId' });

    return {
        bookings,
        cabs,
        drivers,
        oauth_access_tokens,
        oauth_client_resources,
        oauth_client_scopes,
        oauth_clients,
        users
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
