const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'oauth_clients',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            clientId: {
                type: DataTypes.STRING(320),
                allowNull: false,
                unique: 'oauth_clients_client_id',
                field: 'client_id'
            },
            clientSecret: {
                type: DataTypes.STRING(36),
                allowNull: false,
                field: 'client_secret'
            },
            grantType: {
                type: DataTypes.ENUM('CLIENT_CREDENTIALS'),
                allowNull: true,
                field: 'grant_type'
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
                field: 'created_at'
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'updated_at'
            }
        },
        {
            sequelize,
            tableName: 'oauth_clients',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }]
                },
                {
                    name: 'oauth_clients_client_id',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'client_id' }]
                },
                {
                    name: 'client_id',
                    using: 'BTREE',
                    fields: [{ name: 'client_id' }]
                },
                {
                    name: 'client_secret',
                    using: 'BTREE',
                    fields: [{ name: 'client_secret' }]
                }
            ]
        }
    );
};
