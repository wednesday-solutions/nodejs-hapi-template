const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'cabs',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            coordinates: {
                type: 'POINT',
                allowNull: false
            },
            carModel: {
                type: DataTypes.STRING(100),
                allowNull: false,
                field: 'car_model'
            },
            vehicleNumber: {
                type: DataTypes.STRING(8),
                allowNull: false,
                field: 'vehicle_number'
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
                field: 'created_at'
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
                field: 'updated_at'
            }
        },
        {
            sequelize,
            tableName: 'cabs',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }]
                },
                {
                    name: 'coordinates',
                    type: 'SPATIAL',
                    fields: [{ name: 'coordinates', length: 32 }]
                }
            ]
        }
    );
};
