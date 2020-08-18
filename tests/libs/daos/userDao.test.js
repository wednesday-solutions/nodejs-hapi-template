describe('user daos', () => {
    const mockUser = {
        id: 1,
        firstName: 'Sharan',
        lastName: 'Salian',
        email: 'sharan@wednesday.is'
    };
    it('must have findOneUser that finds a user by ID', async () => {
        const { findOneUser } = require('daos/userDao');
        const testUser = await findOneUser(1);
        expect(testUser.id).toEqual(1);
        expect(testUser.firstName).toEqual(mockUser.firstName);
        expect(testUser.lastName).toEqual(mockUser.lastName);
        expect(testUser.email).toEqual(mockUser.email);
    });
    it('must have findAllUser that finds all the users', async () => {
        const { findAllUser } = require('daos/userDao');
        const { allUsers } = await findAllUser(1, 10);
        const firstUser = allUsers[0];
        expect(firstUser.id).toEqual(1);
        expect(firstUser.firstName).toEqual(mockUser.firstName);
        expect(firstUser.lastName).toEqual(mockUser.lastName);
        expect(firstUser.email).toEqual(mockUser.email);
    });
});
