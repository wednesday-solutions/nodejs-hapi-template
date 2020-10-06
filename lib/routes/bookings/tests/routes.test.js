import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

const { MOCK_BOOKING: booking } = mockData;

describe('/bookings route tests ', () => {
    let server;
    beforeEach(async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.bookings.$queryInterface.$useHandler(function(query) {
                if (query === 'findById') {
                    return booking;
                }
            });
        });
    });

    it('should create a booking', async () => {
        const payload = {
            customerId: 1,
            cabID: 1,
            pickup: { lat: -36.65831, long: 2.51266 },
            drop: { lat: -15.04943, long: 169.35806 }
        };
        const res = await server.inject({
            method: 'POST',
            url: '/bookings/booking',
            payload
        });

        expect(res.statusCode).toEqual(200);
        const bookingOne = res.result;
        expect(bookingOne.id).toEqual(booking.id);
        expect(bookingOne.customerId).toEqual(booking.customerId);
        expect(bookingOne.cabId).toEqual(booking.cabId);
        expect(bookingOne.fromLoc).toEqual(booking.fromLoc);
        expect(bookingOne.toLoc).toEqual(booking.toLoc);
    });

    it('should return all the bookings ', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.bookings.$queryInterface.$useHandler(function(query) {
                if (query === 'findById') {
                    return booking;
                }
            });
            allDbs.bookings.count = () => 1;
        });

        const res = await server.inject({
            method: 'GET',
            url: '/bookings'
        });

        expect(res.statusCode).toEqual(200);
        const bookingOne = res.result.results[0];
        expect(bookingOne.id).toEqual(booking.id);
        expect(bookingOne.customer_id).toEqual(booking.customerId);
        expect(bookingOne.cab_id).toEqual(booking.cabId);
        expect(bookingOne.from_loc).toEqual(booking.fromLoc);
        expect(bookingOne.to_loc).toEqual(booking.toLoc);
        expect(res.result.total_count).toEqual(1);
    });

    it('should return notFound if no bookings are found', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.bookings.$queryInterface.$useHandler(function(query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.bookings.count = () => 0;
            allDbs.bookings.findAll = () => null;
        });
        const res = await server.inject({
            method: 'GET',
            url: '/bookings'
        });
        expect(res.statusCode).toEqual(404);
    });

    it('should return badImplementation if findAllbookings fails', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.bookings.$queryInterface.$useHandler(function(query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.bookings.findAll = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'GET',
            url: '/bookings'
        });
        expect(res.statusCode).toEqual(500);
    });
});
