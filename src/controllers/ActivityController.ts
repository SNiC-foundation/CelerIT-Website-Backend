import {
  Body, Controller, Delete, Get, Post, Put, Request, Route, Security, Tags,
} from 'tsoa';
import express from 'express';
import ActivityService, { ActivityResponse } from '../services/ActivityService';
import Activity, { ActivityParams } from '../entities/Activity';
import { ApiError, HTTPStatus } from '../helpers/error';
import UserService from '../services/UserService';
import User from '../entities/User';

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
  public async getAllActivities(): Promise<ActivityResponse[]> {
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
  @Security('local')
  public async createActivity(@Body() params: ActivityParams): Promise<Activity> {
    return new ActivityService().createActivity(params);
  }

  /**
   * updateActivity() - update activity
   * @param id ID of activity to update
   * @param params Update subset of parameter of activity
   */
  @Put('{id}')
  @Security('local')
  public async updateActivity(
    id: number, @Body()
    params: ActivityParams,
  ): Promise<Activity> {
    return new ActivityService().updateActivity(id, params);
  }

  /**
   * Delete activity
   * @param id ID of the activity to delete
   */
  @Delete('{id}')
  @Security('local')
  public async deleteActivity(id: number): Promise<void> {
    return new ActivityService().deleteActivity(id);
  }

  /**
   * Let current user subscribe for an activity, if this
   * activity is a subscribe activity and the user is a participant
   * @param id
   * @param request
   */
  @Post('{id}/subscribe')
  @Security('local')
  public async subscribeToActivity(id: number, @Request() request: express.Request): Promise<void> {
    if (request.user == null) throw new ApiError(HTTPStatus.Forbidden, 'No user logged in');

    const user = await new UserService()
      .getUser((request.user as User).id, { subscriptions: true });
    if (user.participantInfo == null) throw new ApiError(HTTPStatus.Forbidden, 'User does not have participant information');

    await new ActivityService().subscribeToActivity(id, request.user as User);
  }
}
