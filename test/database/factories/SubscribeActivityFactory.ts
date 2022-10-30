import faker from '@faker-js/faker';
import { DataSource, Repository } from 'typeorm';
import SubscribeActivity, { UpdateSubscribeActivityParams } from '../../../src/entities/SubscribeActivity';
// import Factory from './Factory';
import Activity from '../../../src/entities/Activity';

export default class SubscribeActivityFactory { // extends Factory<SubscribeActivity> {
  protected repo: Repository<SubscribeActivity>; // Temp

  constructor(dataSource: DataSource) {
    // super();
    this.repo = dataSource.getRepository(SubscribeActivity);
  }

  private constructObject(activity: Activity): SubscribeActivity {
    const date = faker.date.future();
    const params: UpdateSubscribeActivityParams = {
      maxParticipants: Math.round(Math.random() * 4 + 1) * 100,
      subscriptionListOpenDate: date,
      subscriptionListCloseDate: new Date(date.setHours(
        date.getHours() + 1 + Math.round(Math.random() * 5),
      )),
    };

    const subscribeActivity = new SubscribeActivity();
    subscribeActivity.activityId = activity.id;
    subscribeActivity.maxParticipants = params.maxParticipants;
    subscribeActivity.subscriptionListOpenDate = params.subscriptionListOpenDate;
    subscribeActivity.subscriptionListCloseDate = params.subscriptionListCloseDate;
    return subscribeActivity;
  }

  async createSingle(activity: Activity): Promise<SubscribeActivity> {
    const subscribeActivity = this.constructObject(activity);
    return this.repo.save(subscribeActivity);
  }

  createMultiple(
    activities: Activity[],
    amount: number,
  ): Promise<SubscribeActivity[]> {
    const subscribeActivities: SubscribeActivity[] = [];

    for (let i = 0; i < amount; i += 1) {
      subscribeActivities.push(this.constructObject(
        activities[i % activities.length],
      ));
    }

    return this.repo.save(subscribeActivities);
  }
}
