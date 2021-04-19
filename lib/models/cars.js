const { Sequelize, Model, DataTypes } = require("sequelize");

class Car extends Model {}

module.exports = (sequelize) => {
    Car.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,

            },
            model: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["sedan", "suv", "hatchback"]],
                },
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: "open",
                validate: {
                    isIn: [["open", "inTransit", "offline"]],
                },
            },
            location: {
                type: DataTypes.GEOMETRY("POINT", 4326),
                allowNull: false,
            },
            registrationNo: {
                field: 'registration_no',
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                // We require names to have length of at least 2, and
                // only use letters, numbers and underscores.
                is: /^\w{2,}$/,
            },
            userId: {
                field: 'user_id',
                type: DataTypes.INTEGER,
                allowNull: false,
                index: true,
                references: {
                    model: { tableName: "users" },
                    key: "id",
                },
            },
        },
        {
            sequelize,
            tableName: "cars",
            timestamps: true,
        }
    );

    Car.associate = (models) => {
        Car.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
        });

        Car.hasMany(models.Booking, {
            foreignKey: "id",
            as: "bookings",
        });
    };

    Car.beforeValidate((car, _options) => {
        // coordinates : [ longitude , latitude ]
        if (car.location) {
            car.location = {
                type: "POINT",
                coordinates: [car.location[1], car.location[0]],
            };
        }
    });

    return Car;
};
