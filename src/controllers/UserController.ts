import {
  Controller, Get, Post, Delete, Route, Body, Tags, Put,
} from 'tsoa';
import UserService from '../services/UserService';
import User, { UserParams } from '../entities/User';

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
  public async getAllUsers(): Promise<User[]> {
    return new UserService().getAllUsers();
  }

  /**
   * getUser() - get single user by id
   * @param id ID of user to retrieve
   */
  @Get('{id}')
  public async getUser(id: number): Promise<User> {
    return new UserService().getUser(id);
  }

  /**
   * createUser() - create user
   * @param params Parameters to create user with
   */
  @Post()
  public async createUser(@Body() params: UserParams): Promise<User> {
    return new UserService().createUser(params);
  }

  /**
   * updateUser() - update user
   * @param id ID of user to update
   * @param params Update subset of parameter of user
   */
  @Put('{id}')
  public async updateUser(id: number, @Body() params: Partial<UserParams>): Promise<User> {
    return new UserService().updateUser(id, params);
  }

  /**
   * Delete user
   * @param id ID of the user to delete
   */
  @Delete('{id}')
  public async deleteUser(id: number): Promise<void> {
    return new UserService().deleteUser(id);
  }
}
