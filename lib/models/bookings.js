/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'bookings',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            customerId: {
                field: 'customer_id',
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'users'
                    },
                    key: 'id'
                },
                unique: 'bookings_ibfk_1'
            },
            cabId: {
                field: 'cab_id',
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'cabs'
                    },
                    key: 'id'
                },
                unique: 'bookings_ibfk_2'
            },
            fromLoc: {
                field: 'from_loc',
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'locations'
                    },
                    key: 'id'
                },
                unique: 'bookings_ibfk_3'
            },
            toLoc: {
                field: 'to_loc',
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'locations'
                    },
                    key: 'id'
                },
                unique: 'bookings_ibfk_4'
            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                field: 'updated_at',
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: 'bookings'
        }
    );
};
