import { findOneUser, createOneUser } from '../../lib/daos/userDao';

describe('users daos tests', () => {
    it('should return correct user', async () => {
        const user = await findOneUser(1);
        expect(user.id).toEqual(expect.any(Number));
        expect(user.firstName).toEqual(expect.any(String));
        expect(user.lastName).toEqual(expect.any(String));
        expect(user.email).toEqual(expect.any(String));
    });
    it('should return correct user', async () => {
        const user = await createOneUser(1);
        expect(user.id).toEqual(expect.any(Number));
    });
});
