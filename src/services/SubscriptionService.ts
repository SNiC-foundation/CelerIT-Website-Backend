import { FindOptionsWhere, Repository } from 'typeorm';
import Subscription, { SubscriptionParams } from '../entities/Subscription';
import { getDataSource } from '../database/dataSource';
import { ApiError, HTTPStatus } from '../helpers/error';

export interface SubscriptionFilterParameters {
    subscribeActivityId?: number,
    userId?: number,
}

export default class SubscriptionService {
  repo: Repository<Subscription>;

  constructor(repo?: Repository<Subscription>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(Subscription);
  }

  /**
   * Get all subscriptions
   */
  public async getAllSubscriptions(filters?: SubscriptionFilterParameters): Promise<Subscription[]> {
    const where: FindOptionsWhere<Subscription> = {
      subscribeActivityId: filters?.subscribeActivityId,
      userId: filters?.userId,
    };
    return this.repo.find({ where: { ...where } });
  }

  /**
   * Create a subscription
   */
  public async createSubscription(params: SubscriptionParams): Promise<Subscription> {
    const subscription = Object.assign(new Subscription(), {
      subscribeActivityId: params.subscribeActivityId,
      userId: params.userId,
    });
    return Subscription.save(subscription);
  }

  /**
   * Delete a subscription
   */
  public async deleteSusbscription(params: SubscriptionParams): Promise<void> {
    const where: FindOptionsWhere<Subscription> = {
      subscribeActivityId: params.subscribeActivityId,
      userId: params.userId,
    };
    const subscription = await this.repo.findOne({ where: { ...where } });
    if (subscription == null) throw new ApiError(HTTPStatus.NotFound, 'Subscription not found');
    await this.repo.delete({ ...where });
  }
}
