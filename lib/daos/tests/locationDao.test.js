import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

describe('location daos', () => {
    const { MOCK_LOCATIONS: mockLocations } = mockData;

    describe('findOneLocation', () => {
        it('should find a location by lat and long', async () => {
            const { findOneLocation } = require('daos/locationDao');
            const loc = {
                lat: -36.65831,
                long: 2.51266
            };
            const testLocation = await findOneLocation(loc);
            expect(testLocation.id).toEqual(mockLocations[0].id);
            expect(testLocation.name).toEqual(mockLocations[0].name);
            expect(testLocation.latitude).toEqual(mockLocations[0].latitude);
            expect(testLocation.longitude).toEqual(mockLocations[0].longitude);
        });
        it('should call findOne with the correct parameters', async () => {
            let spy;
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.locations, 'findOne');
            });
            const { findOneLocation } = require('daos/locationDao');

            let loc = {
                lat: -36.65831,
                long: 2.51266
            };
            await findOneLocation(loc);
            expect(spy).toBeCalledWith({
                where: {
                    latitude: loc.lat,
                    longitude: loc.long
                }
            });

            jest.clearAllMocks();
            loc = {
                lat: -15.04943,
                long: 169.35806
            };
            await findOneLocation(loc);
            expect(spy).toBeCalledWith({
                where: {
                    latitude: loc.lat,
                    longitude: loc.long
                }
            });
        });
    });
});
