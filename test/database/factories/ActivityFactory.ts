import faker from '@faker-js/faker';
import { DataSource } from 'typeorm';
import Activity, { ActivityParams } from '../../../src/entities/Activity';
import Factory from './Factory';

export default class ActivityFactory extends Factory<Activity> {
  constructor(dataSource: DataSource) {
    super();
    this.repo = dataSource.getRepository(Activity);
  }

  private constructObject(randomFill: boolean): Activity {
    const [randDesc,
      randImage,
      randMax,
      randId,
    ] = [0, 0, 0, 0].map(() => (randomFill ? Math.random() < 0.5 : false));

    const params: ActivityParams = {
      name: faker.name.findName(),
      location: faker.vehicle.bicycle(),
      programPartId: Math.round(Math.random() * 20) + 5,
      description: randDesc ? faker.animal.bird() : undefined,
      image: randImage ? faker.animal.lion() : undefined,
      maxParticipants: randMax ? Math.round(Math.random() * 100) : undefined,
      speakerId: randId ? Math.round(Math.random() * 1000) + 1000 : undefined,
    };

    const activity = new Activity();
    activity.name = params.name;
    activity.location = params.location;
    activity.programPartId = params.programPartId;
    activity.description = params.description;
    activity.image = params.image;
    activity.maxParticipants = params.maxParticipants;
    activity.image = params.image;
    activity.speakerId = params.speakerId;
    return activity;
  }

  async createSingle(randomFill: boolean = false): Promise<Activity> {
    const activity = this.constructObject(randomFill);
    return this.repo.save(activity);
  }

  createMultiple(amount: number, randomFill: boolean = false): Promise<Activity[]> {
    const activities: Activity[] = [];

    for (let i = 0; i < amount; i += 1) {
      activities.push(this.constructObject(randomFill));
    }

    return this.repo.save(activities);
  }
}
