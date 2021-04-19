const { Sequelize, Model, DataTypes } = require("sequelize");

class Booking extends Model {}

module.exports = (sequelize) => {
    Booking.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["completed", "canceled", "inTransit"]],
                },
            },
            initialLocation: {
                type: DataTypes.GEOMETRY("POINT", 4326),
                allowNull: false,
            },
            finalLocation: {
                type: DataTypes.GEOMETRY("POINT", 4326),
                allowNull: false,
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                field: "user_id",
                type: DataTypes.INTEGER,
                allowNull: false,
                index: true,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            carId: {
                field: "car_id",
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "cars",
                    key: "id",
                },
                
            },
        },
        {
            sequelize,
            tableName: "bookings",
            timestamps: true,
        }
    );

    Booking.associate = (models) => {
        Booking.belongsTo(models.User, {
            foreignKey: "user_id",
        });

        Booking.belongsTo(models.Car, {
            foreignKey: "car_id",
        });
    };

    return Booking;
};
