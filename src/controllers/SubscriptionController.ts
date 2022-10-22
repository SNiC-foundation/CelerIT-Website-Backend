import {
  Controller, Get, Post, Route, Body, Tags, Query, Security, Delete,
} from 'tsoa';
import Subscription, { SubscriptionParams } from '../entities/Subscription';
import SubscriptionService, { SubscriptionFilterParameters } from '../services/SubscriptionService';

/**
 * TODO: add parameter validation
 */
@Route('subscription')
@Tags('Subscription')
export class SubscriptionController extends Controller {
  /**
   * getAllSubscriptions() - retrieve all subscriptions
   * TODO: Add filter options
   */
  @Get('')
  @Security('local')
  public async getAllSubscriptions(@Query() subscribeActivityId?: number, @Query() userId?: number): Promise<Subscription[]> {
    const filters: SubscriptionFilterParameters = {
      subscribeActivityId,
      userId,
    };
    return new SubscriptionService().getAllSubscriptions(filters);
  }

  /**
   * createSubscription() - create a subscription
   * @param params Parameters to create subscription with
   */
  @Post()
  @Security('local')
  public async createSubscription(@Body() params: SubscriptionParams): Promise<Subscription> {
    return new SubscriptionService().createSubscription(params);
  }

  /**
   * deleteSusbcription() - delete a subscription
   * @param params Parameters to delete subscription with
   */
  @Delete()
  @Security('local')
  public async deleteSubscription(@Body() params: SubscriptionParams): Promise<void> {
    return new SubscriptionService().deleteSusbscription(params);
  }
}
