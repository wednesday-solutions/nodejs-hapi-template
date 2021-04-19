import { cars } from 'models';

const attributes = [
    'id',
    'model',
    'status',
    'type',
    'location'
];

export const findOneCar = async carId =>
    cars.findOne({
        attributes,
        where: {
            id: carId
        },
        underscoredAll: false
    });

export const findAllCar = async (page, limit) => {
    const where = {};
    const totalCount = await cars.count({ where });
    const allCars = await cars.findAll({
        attributes,
        where,
        offset: (page - 1) * limit,
        limit
    });
    return { allCars, totalCount };
};
