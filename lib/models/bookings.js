const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'bookings',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                field: 'user_id'
            },
            cabId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'cabs',
                    key: 'id'
                },
                field: 'cab_id'
            },
            pickupLocation: {
                type: DataTypes.STRING(100),
                allowNull: false,
                field: 'pickup_location'
            },
            dropLocation: {
                type: DataTypes.STRING(100),
                allowNull: false,
                field: 'drop_location'
            },
            fare: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0
            },
            distance: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0
            },
            driverId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'drivers',
                    key: 'id'
                },
                field: 'driver_id'
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
                field: 'created_at'
            }
        },
        {
            sequelize,
            tableName: 'bookings',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }]
                },
                {
                    name: 'cab_id',
                    using: 'BTREE',
                    fields: [{ name: 'cab_id' }]
                },
                {
                    name: 'fk_bookings_driver',
                    using: 'BTREE',
                    fields: [{ name: 'driver_id' }]
                },
                {
                    name: 'fk_bookings_userid',
                    using: 'BTREE',
                    fields: [{ name: 'user_id' }]
                }
            ]
        }
    );
};
