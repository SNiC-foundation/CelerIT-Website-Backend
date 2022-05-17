import { DataSource } from 'typeorm';
import { expect } from 'chai';
import { UserController } from '../../../src/controllers/UserController';
import AppDataSource from '../../../src/database/dataSource';
import UserFactory from '../../database/factories/UserFactory';
import User from '../../../src/entities/User';

describe('UserController', () => {
  let ctx: {
    dataSource: DataSource,
    controller: UserController,
    users: User[],
  };

  before(async () => {
    const dataSource = await AppDataSource.initialize();

    const controller = new UserController();

    const users = await (new UserFactory(dataSource)).createMultiple(10);

    ctx = {
      dataSource,
      controller,
      users,
    };
  });

  after(async () => {
    await ctx.dataSource.destroy();

    describe('GET /users', () => {
      it('should return all users', async () => {
        const result = await ctx.controller.getAllUsers();

        expect(result.length).to.equal(ctx.users.length);
      });
    });
  });
});
