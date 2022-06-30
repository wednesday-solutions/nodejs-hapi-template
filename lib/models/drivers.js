const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'drivers',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            phoneNo: {
                type: DataTypes.STRING(10),
                allowNull: false,
                field: 'phone_no'
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
            email: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false
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
            tableName: 'drivers',
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
                }
            ]
        }
    );
};
