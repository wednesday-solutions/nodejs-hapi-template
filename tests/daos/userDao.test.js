import {
    createUser,
    updateUser,
    findUser,
    deleteUser,
    findUserByPk
} from '../../lib/daos/userDao.js';
describe('users daos tests', () => {
    it('should return correct user  if id 1 is present', async () => {
        const user = await findUser({
            id: 1
        });
        expect(user.id.id).toEqual(1);
    });

    it('should return correct of user update with id 1', async () => {
        const user = await updateUser({
            id: 1
        });
        expect(user[0]).toEqual(1);
    });
    it('should return correct of user createUser with id 1', async () => {
        const user = await createUser({
            id: 1
        });
        expect(user.id).toEqual(1);
    });
    it('should return correct of  delete user with id 1', async () => {
        const user = await deleteUser({
            id: 1
        });
        expect(user).toEqual(expect.any(String));
    });
    it('should return correct of find User with id 1', async () => {
        const user = await findUserByPk({
            id: 1
        });
        expect(user.id.id).toEqual(1);
    });
});
