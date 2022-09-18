import { Repository } from 'typeorm';
import Activity, { ActivityParams } from '../entities/Activity';
import { getDataSource } from '../database/dataSource';
import { ApiError, HTTPStatus } from '../helpers/error';
import SubscribeActivity from '../entities/SubscribeActivity';
import SubscribeActivityService from './SubscribeActivityService';

export default class ActivityService {
  repo: Repository<Activity>;

  constructor(repo?: Repository<Activity>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(Activity);
  }

  /**
   * Get all Activities
   */
  public async getAllActivities(): Promise<Activity[]> {
    return this.repo.find();
  }

  /**
   * Get one Activity
   * TODO: Add relations in findOne()
   */
  async getActivity(id: number): Promise<Activity> {
    const activity = await this.repo.findOne({ where: { id } });
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
    let ac = await this.repo.save(activity);
    ac = await this.getActivity(activity.id);
    return ac;
  }

  /**
   * Update Activity
   */
  async updateActivity(id: number, params: ActivityParams): Promise<Activity> {
    const { subscribe, ...rest } = params;
    await this.repo.update(id, rest);
    const activity = await this.getActivity(id);

    if (activity == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    if (activity.subscribe && subscribe) {
      await new SubscribeActivityService()
        .updateSubscribeActivity(activity.subscribe.id, subscribe);
    } else if (!activity.subscribe && subscribe) {
      await new SubscribeActivityService()
        .createSubscribeActivity({
          ...subscribe,
          activityId: activity.id,
        });
    } else if (activity.subscribe && !subscribe) {
      await new SubscribeActivityService().deleteSubscribeActivity(activity.subscribe.id);
    }

    return this.getActivity(id);
  }

  /**
   * Delete Activity
   * TODO: Add relations in findOne()
   */
  async deleteActivity(id: number): Promise<void> {
    const activity = await this.repo.findOne({ where: { id } });

    if (activity == null) {
      throw new ApiError(HTTPStatus.NotFound, 'Activity not found');
    }

    if (activity.subscribe != null) {
      await new SubscribeActivityService().deleteSubscribeActivity(activity.subscribe.id);
    }

    await this.repo.delete(activity.id);
  }
}
