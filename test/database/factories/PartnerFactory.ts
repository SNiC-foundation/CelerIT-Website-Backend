import faker from '@faker-js/faker';
import { DataSource, Repository } from 'typeorm';
import Partner, { PartnerParams, SponsorPackage } from '../../../src/entities/Partner';
// import Factory from './Factory';

export default class PartnerFactory { // extends Factory<Partner> {
  protected repo: Repository<Partner>; // Temp

  constructor(dataSource: DataSource) {
    // super();
    this.repo = dataSource.getRepository(Partner);
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private constructObject(): Partner {
    const params: PartnerParams = {
      name: `${this.capitalizeFirstLetter(faker.random.word())} ${this.capitalizeFirstLetter(faker.word.noun())} Inc.`,
      location: faker.random.word(),
      specialization: `${faker.word.adjective()} ${faker.word.noun()}`,
      description: faker.random.words(10),
      url: `www.${faker.vehicle.fuel().toLowerCase()}.com`,
      package: SponsorPackage.BRONZE,
    };

    const partner = new Partner();
    partner.name = params.name;
    partner.location = params.location;
    partner.specialization = params.specialization;
    partner.description = params.description;
    partner.url = params.url;
    return partner;
  }

  async createSingle(): Promise<Partner> {
    const partner = this.constructObject();
    return this.repo.save(partner);
  }

  createMultiple(amount: number): Promise<Partner[]> {
    const activities: Partner[] = [];

    for (let i = 0; i < amount; i += 1) {
      activities.push(this.constructObject());
    }

    return this.repo.save(activities);
  }
}
