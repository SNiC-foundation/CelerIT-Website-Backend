import faker from '@faker-js/faker';
import { DataSource } from 'typeorm';
import User, { UserParams } from '../../../src/entities/User';
import Factory from './Factory';
import TicketFactory from './TicketFactory';

export default class UserFactory extends Factory<User> {
  constructor(dataSource: DataSource) {
    super();
    this.repo = dataSource.getRepository(User);
    this.ticketFactory = new TicketFactory(dataSource);
  }

  private ticketFactory;

  private constructObject(): User {
    const params: UserParams = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      dietaryWishes: faker.animal.type(),
      agreeToPrivacyPolicy: Math.random() > 0.5,
    };
    const user = new User();
    user.name = params.name;
    user.email = params.email.toLowerCase();
    user.dietaryWishes = params.dietaryWishes;
    user.agreeToPrivacyPolicy = params.agreeToPrivacyPolicy;

    return user;
  }

  async createSingle(): Promise<User> {
    let user = this.constructObject();
    user = await this.repo.save(user);
    await this.ticketFactory.createSingleWithUser(user);
    return user;
  }

  createMultiple(amount: number): Promise<User[]> {
    const users: User[] = [];

    for (let i = 0; i < amount; i += 1) {
      users.push(this.constructObject());
    }

    return this.repo.save(users).then(() => Promise.all(users.map(
      (u) => this.ticketFactory.createSingleWithUser(u),
    )).then(() => users));
  }
}
