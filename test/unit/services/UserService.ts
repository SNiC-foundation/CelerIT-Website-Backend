import { DataSource } from 'typeorm';
import { expect } from 'chai';
import { initializeDataSource } from '../../../src/database/dataSource';
import User from '../../../src/entities/User';
import UserFactory from '../../database/factories/UserFactory';
import UserService from '../../../src/services/UserService';

describe('UserService', () => {
  let dataSource: DataSource;
  let ctx: {
    service: UserService,
    users: User[],
  };

  before(async () => {
    dataSource = await initializeDataSource();

    const service = new UserService();

    const users = [await (new UserFactory(dataSource)).createSingle()];

    ctx = {
      service,
      users,
    };
  });

  after(async () => {
    await dataSource.destroy();
  });

  describe('getAllUsers', () => {
    it('should correctly get all users', async () => {
      const users = await ctx.service.getAllUsers();

      expect(users.length).to.equal(ctx.users.length);
    });
  });
});
