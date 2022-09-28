import { resetAndMockDB } from '@utils/testUtils';
import { mockData } from '@utils/mockData';

describe('user daos', () => {
  const { MOCK_USER: mockUser } = mockData;
  const attributes = [
    'id',
    'first_name',
    'last_name',
    'email',
    'oauth_client_id',
  ];

  describe('findOneUser', () => {
    it('should find a user by ID', async () => {
      const { findOneUser } = require('@daos/userDao');
      const testUser = await findOneUser(1);
      expect(testUser.id).toEqual(1);
      expect(testUser.firstName).toEqual(mockUser.firstName);
      expect(testUser.lastName).toEqual(mockUser.lastName);
      expect(testUser.email).toEqual(mockUser.email);
    });
    it('should call findOne with the correct parameters', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.users, 'findOne');
      });
      const { findOneUser } = require('@daos/userDao');

      let userId = 1;
      await findOneUser(userId);
      expect(spy).toBeCalledWith({
        attributes,
        underscoredAll: false,
        where: {
          id: userId,
        },
      });

      jest.clearAllMocks();
      userId = 2;
      await findOneUser(userId);
      expect(spy).toBeCalledWith({
        attributes,
        underscoredAll: false,
        where: {
          id: userId,
        },
      });
    });
  });

  describe('findAllUser ', () => {
    let spy;
    const where = {};
    let page = 1;
    let limit = 10;
    let offset = (page - 1) * limit;

    it('should find all the users', async () => {
      const { findAllUser } = require('@daos/userDao');
      const { allUsers } = await findAllUser(1, 10);
      const firstUser = allUsers[0];
      expect(firstUser.id).toEqual(1);
      expect(firstUser.firstName).toEqual(mockUser.firstName);
      expect(firstUser.lastName).toEqual(mockUser.lastName);
      expect(firstUser.email).toEqual(mockUser.email);
    });

    it('should call findAll with the correct parameters', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.users, 'findAll');
      });
      const { findAllUser } = require('@daos/userDao');
      await findAllUser(page, limit);
      expect(spy).toBeCalledWith({
        attributes,
        where,
        offset,
        limit,
      });
      jest.clearAllMocks();
      page = 2;
      limit = 10;
      offset = (page - 1) * limit;
      await findAllUser(page, limit);
      expect(spy).toBeCalledWith({
        attributes,
        where,
        offset,
        limit,
      });
    });
    it('should call count with an empty object', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.users, 'count');
      });
      const { findAllUser } = require('@daos/userDao');
      await findAllUser(page, limit);
      expect(spy).toBeCalledWith({ where });
    });
  });
});
