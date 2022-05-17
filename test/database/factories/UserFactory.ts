import faker from '@faker-js/faker';
import { DataSource } from 'typeorm';
import User, { UserParams } from '../../../src/entities/User';
import Factory from './Factory';

export default class UserFactory extends Factory<User> {
  constructor(dataSource: DataSource) {
    super();
    this.repo = dataSource.getRepository(User);
  }

  private constructObject(): User {
    const params: UserParams = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      dietaryWishes: '',
      agreeToPrivacyPolicy: true,
    };
    const user = new User();
    user.name = params.name;
    user.email = params.email;
    user.dietaryWishes = params.dietaryWishes;
    user.agreeToPrivacyPolicy = params.agreeToPrivacyPolicy;

    return user;
  }

  async createSingle(): Promise<User> {
    const user = this.constructObject();
    return this.repo.save(user);
  }

  createMultiple(amount: number): Promise<User[]> {
    const users: User[] = [];

    for (let i = 0; i < amount; i += 1) {
      users.push(this.constructObject());
    }

    return this.repo.save(users);
  }
}
