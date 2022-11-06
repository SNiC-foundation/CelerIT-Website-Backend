import {
  Body, Controller, Delete, Get, Post, Put, Query, Request, Route, Security, Tags,
} from 'tsoa';
import express from 'express';
import UserService, { SendSetPasswordReminderParams } from '../services/UserService';
import User, { PersonalUserParams, UserParams } from '../entities/User';
import { ApiError, HTTPStatus } from '../helpers/error';
import AuthService from '../services/AuthService';

/**
 * TODO: Add paramater validation
 */

@Route('user')
@Tags('User')
export class UserController extends Controller {
  /**
   * getAllUsers() - retrieve all users
   * TODO: Add filter options
   */
  @Get('')
  @Security('local', ['Admin'])
  public async getAllUsers(): Promise<User[]> {
    return new UserService().getAllUsers();
  }

  /**
   * getUser() - get single user by id
   * @param id ID of user to retrieve
   */
  @Get('{id}')
  @Security('local', ['Admin'])
  public async getUser(id: number): Promise<User> {
    return new UserService().getUser(id);
  }

  /**
   * createUser() - create user
   * @param params Parameters to create user with
   */
  @Post()
  @Security('local', ['Admin'])
  public async createUser(@Body() params: UserParams): Promise<User> {
    const user = await new UserService().createUser(params);
    await new AuthService().createIdentityLocal(user, false, false);
    return user;
  }

  /**
   * updateUser() - update user
   * @param id ID of user to update
   * @param params Update subset of parameter of user
   */
  @Put('{id}')
  @Security('local', ['Admin'])
  public async updateUser(id: number, @Body() params: Partial<UserParams>): Promise<User> {
    return new UserService().updateUser(id, params);
  }

  /**
   * updateUser() - update your own profile
   * @param id ID of user to update
   * @param params Update subset of parameter of user
   * @param request
   */
  @Put('{id}/profile')
  @Security('local')
  public async updateUserProfile(
    id: number,
    @Body() params: Partial<PersonalUserParams>,
    @Request() request: express.Request,
  ): Promise<User> {
    if ((request.user as User).id !== id) throw new ApiError(HTTPStatus.Forbidden, 'Forbidden');
    return new UserService().updateUserProfile(id, params);
  }

  /**
   * updateUserRoles() - update user roles
   * @param id ID of user to update
   * @param roleIds IDs of all roles this user should have
   */
  @Put('{id}/roles')
  @Security('local', ['Admin'])
  public async updateUserRoles(id: number, @Body() roleIds: number[]): Promise<User> {
    return new UserService().updateUserRoles(id, roleIds);
  }

  /**
   * Delete user
   * @param id ID of the user to delete
   */
  @Delete('{id}')
  @Security('local', ['Admin'])
  public async deleteUser(id: number): Promise<void> {
    return new UserService().deleteUser(id);
  }

  /**
   * Get all users who still haven't set a password for their account.
   * @param date User creation date for which people should receive an email
   */
  @Get('mail/set-password-reminder')
  @Security('local', ['Admin'])
  public async getSetPasswordReminderUsers(@Query() date: Date): Promise<User[]> {
    return new UserService().getSetPasswordReminderUsers(date);
  }

  /**
   * Send an email to all users who still have to set a password
   * @param params
   */
  @Post('mail/set-password-reminder')
  @Security('local', ['Admin'])
  public async sendSetPasswordReminder(
    @Body() params: SendSetPasswordReminderParams,
  ): Promise<void> {
    await new UserService().sendSetPasswordReminders(params);
  }

  /**
   * Get all users who have not yet subscribed to 3 or more tracks
   */
  @Get('mail/tracks-reminder')
  @Security('local', ['Admin'])
  public async getTracksReminderUsers(): Promise<User[]> {
    return new UserService().getTrackReminderUsers();
  }

  /**
   * Send an email to all users who still have to subscribe for at least one track
   * @param ids
   */
  @Post('mail/tracks-reminder')
  @Security('local', ['Admin'])
  public async sendTracksReminders(@Body() ids: number[]): Promise<void> {
    await new UserService().sendTrackReminders(ids);
  }
}
