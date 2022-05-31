import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put,
} from 'tsoa';
import ActivityService from '../services/ActivityService';
import Activity, { ActivityParams } from '../entities/Activity';

/**
 * TODO: Add paramater validation
 */

@Route('activity')
@Tags('Activity')
export class ActivityController extends Controller {
  /**
   * getAllActivities() - retrieve all activities
   * TODO: Add filter options
   */
  @Get('')
  public async getAllActivities(): Promise<Activity[]> {
    return new ActivityService().getAllActivities();
  }

  /**
   * getActivity() - get single activity by id
   * @param id ID of activity to retrieve
   */
  @Get('{id}')
  public async getActivity(id: number): Promise<Activity> {
    return new ActivityService().getActivity(id);
  }

  /**
   * createActivity() - create activity
   * @param params Parameters to create activity with
   */
  @Post()
  public async createActivity(@Body() params: ActivityParams): Promise<Activity> {
    return new ActivityService().createActivity(params);
  }

  /**
   * updateActivity() - update activity
   * @param id ID of activity to update
   * @param params Update subset of parameter of activity
   */
  @Put('{id}')
  public async updateActivity(
    id: number, @Body()
    params: Partial<ActivityParams>,
  ): Promise<Activity> {
    return new ActivityService().updateActivity(id, params);
  }

  /**
   * Delete activity
   * @param id ID of the activity to delete
   */
  @Delete('{id}')
  public async deleteActivity(id: number): Promise<void> {
    return new ActivityService().deleteActivity(id);
  }
}
