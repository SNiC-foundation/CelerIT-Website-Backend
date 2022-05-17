import faker from '@faker-js/faker';
import { DataSource, Repository } from 'typeorm';
import Activity, { ActivityParams } from '../../../src/entities/Activity';
// import Factory from './Factory';
import ProgramPart from '../../../src/entities/ProgramPart';
import Speaker from '../../../src/entities/Speaker';

export default class ActivityFactory { // extends Factory<Activity> {
  protected repo: Repository<Activity>; // Temp

  constructor(dataSource: DataSource) {
    // super();
    this.repo = dataSource.getRepository(Activity);
  }

  private constructObject(
    programPart: ProgramPart,
    speaker: Speaker,
    randomFill: boolean,
  ): Activity {
    const [randDesc,
      randImage,
      randMax,
      randSpeaker,
    ] = [0, 0, 0, 0].map(() => (randomFill ? Math.random() < 0.5 : false));

    const params: ActivityParams = {
      name: faker.name.findName(),
      location: faker.vehicle.bicycle(),
      programPartId: programPart.id,
      description: randDesc ? faker.animal.bird() : undefined,
      image: randImage ? faker.animal.lion() : undefined,
      maxParticipants: randMax ? Math.round(Math.random() * 100) : undefined,
      speakerId: randSpeaker ? speaker.id : undefined,
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

  async createSingle(
    programParts: ProgramPart,
    speakers: Speaker,
    randomFill: boolean = false,
  ): Promise<Activity> {
    const activity = this.constructObject(programParts, speakers, randomFill);
    return this.repo.save(activity);
  }

  createMultiple(
    programParts: ProgramPart[],
    speakers: Speaker[],
    amount: number,
    randomFill: boolean = false,
  ): Promise<Activity[]> {
    const activities: Activity[] = [];

    for (let i = 0; i < amount; i += 1) {
      activities.push(this.constructObject(
        programParts[i % programParts.length],
        speakers[i % speakers.length],
        randomFill,
      ));
    }

    return this.repo.save(activities);
  }
}
