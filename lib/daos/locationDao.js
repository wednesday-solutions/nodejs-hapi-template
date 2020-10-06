import { locations } from 'models';

export const findOneLocation = async location => {
    const loc = await locations.findOne({
        where: {
            latitude: location.lat,
            longitude: location.long
        }
    });

    return loc;
};
