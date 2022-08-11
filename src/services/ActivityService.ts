import { Repository } from 'typeorm';
import Activity, { ActivityParams } from '../entities/Activity';
import { getDataSource } from '../database/dataSource';
import { ApiError, HTTPStatus } from '../helpers/error';
import SubscribeActivity from '../entities/SubscribeActivity';

export default class ActivityService {
  activityRepo: Repository<Activity>;

  subscribeRepo: Repository<SubscribeActivity>;

  constructor(repo?: Repository<Activity>) {
    this.activityRepo = repo !== undefined ? repo : getDataSource().getRepository(Activity);
    this.subscribeRepo = getDataSource().getRepository(SubscribeActivity);
  }

  /**
   * Get all Activities
   */
  public async getAllActivities(): Promise<Activity[]> {
    return this.activityRepo.find({ relations: ['subscribe'] });
  }

  /**
   * Get one Activity
   * TODO: Add relations in findOne()
   */
  async getActivity(id: number): Promise<Activity> {
    const activity = await this.activityRepo.findOne({ where: { id }, relations: ['subscribe'] });
    if (activity == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Activity not found');
    }
    return activity;
  }

  /**
   * Create Activity
   */
  async createActivity(params: ActivityParams): Promise<Activity> {
    const activity = {
      ...params,
    } as any as Activity;
    let ac = await this.activityRepo.save(activity);
    if (params.subscribe) {
      await this.subscribeRepo.save({
        ...params.subscribe,
        activityId: ac.id,
      });
    }
    ac = await this.getActivity(activity.id);
    return ac;
  }

  /**
   * Update Activity
   */
  async updateActivity(id: number, params: ActivityParams): Promise<Activity> {
    const { subscribe, ...rest } = params;
    await this.activityRepo.update(id, rest);
    const activity = await this.getActivity(id);

    if (activity == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    if (activity.subscribe && subscribe) {
      await this.subscribeRepo.update(activity.subscribe.id, subscribe);
    } else if (!activity.subscribe && subscribe) {
      await this.subscribeRepo.save(subscribe);
    } else if (activity.subscribe && !subscribe) {
      const subscr = await this.subscribeRepo.findOne({ where: { id: activity.subscribe.id }, relations: ['subscribers'] });
      if (subscr!.subscribers.length > 0) throw new ApiError(HTTPStatus.BadRequest, 'SubscribeActivity still has subscribers');
      await this.subscribeRepo.delete(subscr!.id);
    }

    return this.getActivity(id);
  }

  /**
   * Delete Activity
   * TODO: Add relations in findOne()
   */
  async deleteActivity(id: number): Promise<void> {
    const activity = await this.activityRepo.findOne({ where: { id } });

    if (activity == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Activity not found');
    }

    await this.activityRepo.delete(activity.id);
  }
}
