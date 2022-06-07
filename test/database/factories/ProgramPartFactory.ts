import faker from '@faker-js/faker';
import { DataSource } from 'typeorm';
import ProgramPart, { ProgramPartParams } from '../../../src/entities/ProgramPart';
import Factory from './Factory';

export default class ProgramPartFactory extends Factory<ProgramPart> {
  constructor(dataSource: DataSource) {
    super();
    this.repo = dataSource.getRepository(ProgramPart);
  }

  private constructObject(): ProgramPart {
    const date = faker.date.future();
    const params: ProgramPartParams = {
      beginTime: date,
      endTime: new Date(date.setHours(date.getHours() + 1 + Math.round(Math.random() * 5))),
    };

    const programPart = new ProgramPart();
    programPart.beginTime = params.beginTime;
    programPart.endTime = params.endTime;
    return programPart;
  }

  async createSingle(): Promise<ProgramPart> {
    const programPart = this.constructObject();
    return this.repo.save(programPart);
  }

  createMultiple(amount: number): Promise<ProgramPart[]> {
    const activities: ProgramPart[] = [];

    for (let i = 0; i < amount; i += 1) {
      activities.push(this.constructObject());
    }

    return this.repo.save(activities);
  }
}
