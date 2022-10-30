import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put, Security,
} from 'tsoa';
import SubscribeActivityService from '../services/SubscribeActivityService';
import SubscribeActivity, {
  UpdateSubscribeActivityParams,
  CreateSubscribeActivityParams,
} from '../entities/SubscribeActivity';

/**
 * TODO: Add paramater validation
 */

@Route('subscribeActivity')
@Tags('SubscribeActivity')
export class SubscribeActivityController extends Controller {
  /**
   * getAllSubscribeActivities() - retrieve all subscribeActivities
   * TODO: Add filter options
   */
  @Get('')
  public async getAllSubscribeActivities(): Promise<SubscribeActivity[]> {
    return new SubscribeActivityService().getAllSubscribeActivities();
  }

  /**
   * getSubscribeActivity() - get single subscribeActivity by id
   * @param id ID of subscribeActivity to retrieve
   */
  @Get('{id}')
  public async getSubscribeActivity(id: number): Promise<SubscribeActivity> {
    return new SubscribeActivityService().getSubscribeActivity(id);
  }

  /**
   * createSubscribeActivity() - create subscribeActivity
   * @param params Parameters to create subscribeActivity with
   */
  @Post()
  @Security('local', ['Admin'])
  public async createSubscribeActivity(@Body() params: CreateSubscribeActivityParams)
      : Promise<SubscribeActivity> {
    return new SubscribeActivityService().createSubscribeActivity(params);
  }

  /**
   * updateSubscribeActivity() - update subscribeActivity
   * @param id ID of subscribeActivity to update
   * @param params Update subset of parameter of subscribeActivity
   */
  @Put('{id}')
  @Security('local', ['Admin'])
  public async updateSubscribeActivity(
    id: number,
    @Body() params: Partial<UpdateSubscribeActivityParams>,
  ):
      Promise<SubscribeActivity> {
    return new SubscribeActivityService().updateSubscribeActivity(id, params);
  }

  /**
   * Delete subscribeActivity
   * @param id ID of the subscribeActivity to delete
   */
  @Delete('{id}')
  @Security('local', ['Admin'])
  public async deleteSubscribeActivity(id: number): Promise<void> {
    return new SubscribeActivityService().deleteSubscribeActivity(id);
  }
}
