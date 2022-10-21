import faker from '@faker-js/faker';
import { DataSource, Repository } from 'typeorm';
import Participant, { UpdateParticipantParams } from '../../../src/entities/Participant';
// import Factory from './Factory';
import User from '../../../src/entities/User';

export default class ParticipantFactory { // extends Factory<Participant> {
  protected repo: Repository<Participant>; // Temp

  constructor(dataSource: DataSource) {
    // super();
    this.repo = dataSource.getRepository(Participant);
  }

  private constructObject(user: User): Participant {
    const params: UpdateParticipantParams = {
      studyAssociation: `${faker.name.middleName()}  ${faker.animal.snake()}`,
      studyProgram: faker.vehicle.model(),
    };

    const participant = new Participant();
    participant.userId = user.id;
    participant.studyAssociation = params.studyAssociation;
    participant.studyProgram = params.studyProgram;
    return participant;
  }

  async createSingle(user: User): Promise<Participant> {
    const participant = this.constructObject(user);
    return this.repo.save(participant);
  }

  createMultiple(
    users: User[],
    amount: number,
  ): Promise<Participant[]> {
    const activities: Participant[] = [];

    for (let i = 0; i < amount; i += 1) {
      activities.push(this.constructObject(
        users[i % users.length],
      ));
    }

    return this.repo.save(activities);
  }
}
