import faker from '@faker-js/faker';
import { DataSource, Repository } from 'typeorm';
import Participant, { ParticipantParams } from '../../../src/entities/Participant';
// import Factory from './Factory';
import User from '../../../src/entities/User';

export default class ParticipantFactory { // extends Factory<Participant> {
  protected repo: Repository<Participant>; // Temp

  constructor(dataSource: DataSource) {
    // super();
    this.repo = dataSource.getRepository(Participant);
  }

  private constructObject(user: User, randomFill: boolean): Participant {
    const [randAssoc,
      randProgram,
      randAgree,
    ] = [0, 0, 0].map(() => (randomFill ? Math.random() < 0.5 : false));

    const params: ParticipantParams = {
      userId: user.id,
      studyAssociation: randAssoc ? `${faker.name.middleName()}  ${faker.animal.snake()}` : undefined,
      studyProgram: randProgram ? faker.vehicle.model() : undefined,
      agreeToSharingWithCompanies: randAgree,
    };

    const participant = new Participant();
    participant.userId = params.userId;
    participant.studyAssociation = params.studyAssociation;
    participant.studyProgram = params.studyProgram;
    participant.agreeToSharingWithCompanies = params.agreeToSharingWithCompanies;
    return participant;
  }

  async createSingle(user: User, randomFill: boolean = false): Promise<Participant> {
    const participant = this.constructObject(user, randomFill);
    return this.repo.save(participant);
  }

  createMultiple(
    users: User[],
    amount: number,
    randomFill: boolean = false,
  ): Promise<Participant[]> {
    const activities: Participant[] = [];

    for (let i = 0; i < amount; i += 1) {
      activities.push(this.constructObject(
        users[i % users.length],
        randomFill,
      ));
    }

    return this.repo.save(activities);
  }
}
