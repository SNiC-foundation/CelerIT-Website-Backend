import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put, Security,
} from 'tsoa';
import UserService from '../services/UserService';
import User, { PersonalUserParams, UserParams } from '../entities/User';

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
  @Security('local')
  public async getAllUsers(): Promise<User[]> {
    return new UserService().getAllUsers();
  }

  /**
   * getUser() - get single user by id
   * @param id ID of user to retrieve
   */
  @Get('{id}')
  @Security('local')
  public async getUser(id: number): Promise<User> {
    return new UserService().getUser(id);
  }

  /**
   * createUser() - create user
   * @param params Parameters to create user with
   */
  @Post()
  @Security('local')
  public async createUser(@Body() params: UserParams): Promise<User> {
    return new UserService().createUser(params);
  }

  /**
   * updateUser() - update user
   * @param id ID of user to update
   * @param params Update subset of parameter of user
   */
  @Put('{id}')
  @Security('local')
  public async updateUser(id: number, @Body() params: Partial<UserParams>): Promise<User> {
    return new UserService().updateUser(id, params);
  }

  /**
   * updateUser() - update your own profile
   * @param id ID of user to update
   * @param params Update subset of parameter of user
   */
  @Put('{id}/profile')
  @Security('local')
  public async updateUserProfile(
    id: number,
    @Body() params: Partial<PersonalUserParams>,
  ): Promise<User> {
    return new UserService().updateUserProfile(id, params);
  }

  /**
   * updateUserRoles() - update user roles
   * @param id ID of user to update
   * @param roleIds IDs of all roles this user should have
   */
  @Put('{id}/roles')
  @Security('local')
  public async updateUserRoles(id: number, @Body() roleIds: number[]): Promise<User> {
    return new UserService().updateUserRoles(id, roleIds);
  }

  /**
   * Delete user
   * @param id ID of the user to delete
   */
  @Delete('{id}')
  @Security('local')
  public async deleteUser(id: number): Promise<void> {
    return new UserService().deleteUser(id);
  }
}
