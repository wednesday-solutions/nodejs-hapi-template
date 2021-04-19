import { cars } from 'models';

const attributes = ['id', 'model', 'status', 'type', 'location'];

export const createOneCar = async ({
    model,
    status,
    type,
    registrationNo,
    userId,
    location
}) =>
    cars.create({
        model,
        status,
        registrationNo,
        type,
        userId,
        location
    });

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
    const totalCountPromise = cars.count({ where });
    const allCarsPromise = cars.findAll({
        attributes,
        where,
        offset: (page - 1) * limit,
        limit
    });

    const [totalCount, allCars] = await Promise.all([
        totalCountPromise,
        allCarsPromise
    ]);

    return { allCars, totalCount };
};
