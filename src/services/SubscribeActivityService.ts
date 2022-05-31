import { Repository } from 'typeorm';
import SubscribeActivity, { SubscribeActivityParams } from '../entities/SubscribeActivity';
import AppDataSource from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';

export default class SubscribeActivityService {
  repo: Repository<SubscribeActivity>;

  constructor(repo?: Repository<SubscribeActivity>) {
    this.repo = repo !== undefined ? repo : AppDataSource.getRepository(SubscribeActivity);
  }

  /**
   * Get all SubscribeActivities
   */
  public async getAllSubscribeActivities(): Promise<SubscribeActivity[]> {
    return this.repo.find();
  }

  /**
   * Get one SubscribeActivity
   * TODO: Add relations in findOne()
   */
  async getSubscribeActivity(id: number): Promise<SubscribeActivity> {
    const subscribeActivity = await this.repo.findOne({ where: { id } });
    if (subscribeActivity == null) {
      throw new ApiError(HTTPStatus.NotFound, 'SubscribeActivity not found');
    }
    return subscribeActivity;
  }

  /**
   * Create SubscribeActivity
   */
  createSubscribeActivity(params: SubscribeActivityParams): Promise<SubscribeActivity> {
    const subscribeActivity = {
      ...params,
    } as any as SubscribeActivity;
    return this.repo.save(subscribeActivity);
  }

  /**
   * Update SubscribeActivity
   */
  async updateSubscribeActivity(
    id: number,
    params: Partial<SubscribeActivityParams>,
  ):
      Promise<SubscribeActivity> {
    await this.repo.update(id, params);
    const subscribeActivity = await this.getSubscribeActivity(id);

    if (subscribeActivity == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    return subscribeActivity;
  }

  /**
   * Delete SubscribeActivity
   * TODO: Add relations in findOne()
   */
  async deleteSubscribeActivity(id: number): Promise<void> {
    const subscribeActivity = await this.repo.findOne({ where: { id } });

    if (subscribeActivity == null) {
      throw new ApiError(HTTPStatus.NotFound, 'SubscribeActivity not found');
    }

    await this.repo.delete(subscribeActivity.id);
  }
}
