import { Repository } from 'typeorm';
import Activity, { ActivityParams } from '../entities/Activity';
import { getDataSource } from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';

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
  createActivity(params: ActivityParams): Promise<Activity> {
    const activity = {
      ...params,
    } as any as Activity;
    return this.repo.save(activity);
  }

  /**
   * Update Activity
   */
  async updateActivity(id: number, params: Partial<ActivityParams>): Promise<Activity> {
    await this.repo.update(id, params);
    const activity = await this.getActivity(id);

    if (activity == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    return activity;
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

    await this.repo.delete(activity.id);
  }
}
