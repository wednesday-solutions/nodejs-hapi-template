import get from 'lodash/get';
import { createBooking, findAllBooking } from 'daos/bookingDao';
import { transformDbArrayResponseToRawResponse } from 'utils/transformerUtils';
import { notFound, badImplementation } from 'utils/responseInterceptors';

module.exports = [
    {
        method: 'POST',
        path: '/booking',
        options: {
            description: 'book a cab for a user',
            notes: 'POST book API',
            tags: ['api', 'bookings'],
            cors: true,
            auth: false
        },
        handler: async request => {
            const customerId = request.payload.customerId;
            const cabId = request.payload.cabId;
            const pickup = request.payload.pickup;
            const drop = request.payload.drop;
            const booking = await createBooking(
                customerId,
                cabId,
                pickup,
                drop
            );
            return booking;
        }
    },
    {
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            const { page, limit } = request.query;
            return findAllBooking(page, limit)
                .then(bookings => {
                    if (get(bookings.allBookings, 'length')) {
                        const totalCount = bookings.totalCount;
                        const allBookings = transformDbArrayResponseToRawResponse(
                            bookings.allBookings
                        ).map(booking => booking);

                        return h.response({
                            results: allBookings,
                            totalCount
                        });
                    }
                    return notFound('No bookings found');
                })
                .catch(error => badImplementation(error.message));
        },
        options: {
            description: 'get past bookings of the user',
            notes: 'GET bookings API',
            tags: ['api', 'bookings'],
            plugins: {
                pagination: {
                    enabled: true
                },
                query: {
                    pagination: true
                }
            },
            auth: false
        }
    }
];
