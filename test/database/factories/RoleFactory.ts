import faker from '@faker-js/faker';
import { DataSource } from 'typeorm';
import Role, { RoleParams } from '../../../src/entities/Role';
import Factory from './Factory';

export default class RoleFactory extends Factory<Role> {
  constructor(dataSource: DataSource) {
    super();
    this.repo = dataSource.getRepository(Role);
  }

  private constructObject(): Role {
    const params: RoleParams = {
      name: faker.word.adjective(),
    };

    const role = new Role();
    role.name = params.name;
    return role;
  }

  async createSingle(): Promise<Role> {
    const role = this.constructObject();
    return this.repo.save(role);
  }

  createMultiple(amount: number): Promise<Role[]> {
    const activities: Role[] = [];

    for (let i = 0; i < amount; i += 1) {
      activities.push(this.constructObject());
    }

    return this.repo.save(activities);
  }
}
