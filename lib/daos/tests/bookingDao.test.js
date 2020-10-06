import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

describe('booking daos', () => {
    const { MOCK_BOOKING: mockBooking } = mockData;

    describe('createBooking', () => {
        it('should call create with the correct parameters', async () => {
            let spy;
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.bookings, 'create');
            });
            const { createBooking } = require('daos/bookingDao');

            const booking = {
                customerId: 1,
                cabId: 1,
                pickup: { lat: -36.65831, long: 2.51266 },
                drop: { lat: -15.04943, long: 169.35806 }
            };
            await createBooking(
                booking.customerId,
                booking.cabId,
                booking.pickup,
                booking.drop
            );
            expect(spy).toBeCalledWith({
                customerId: mockBooking.customerId,
                cabId: mockBooking.cabId,
                fromLoc: mockBooking.fromLoc,
                toLoc: mockBooking.toLoc
            });
        });
    });
});
