import { bookings } from 'models';
import { findOneLocation } from 'daos/locationDao';

const attributes = ['id', 'customerId', 'cabId', 'fromLoc', 'toLoc'];

export const createBooking = async (customerId, cabId, pickup, drop) => {
    const pickupLocId = (await findOneLocation(pickup)).id;
    const dropLocId = (await findOneLocation(drop)).id;
    const booking = await bookings.create({
        customerId,
        cabId,
        fromLoc: pickupLocId,
        toLoc: dropLocId
    });
    return booking;
};

export const findAllBooking = async (page, limit) => {
    const where = {};
    const totalCount = await bookings.count({ where });
    const allBookings = await bookings.findAll({
        attributes,
        where,
        offset: (page - 1) * limit,
        limit
    });
    return { allBookings, totalCount };
};
