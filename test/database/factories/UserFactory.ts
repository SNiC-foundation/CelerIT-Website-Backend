import faker from '@faker-js/faker';
import { DataSource, Repository } from 'typeorm';
import User, { UserParams } from '../../../src/entities/User';

export default class UserFactory {
  repo: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(User);
  }

  async createSingleUser(): Promise<User> {
    const params: UserParams = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
    };
    const user = new User();
    user.name = params.name;
    user.email = params.email;

    return this.repo.save(user);
  }
}
