import {
  Controller, Get, Route, Tags,
} from 'tsoa';
import UserService from '../services/UserService';
import User from '../entities/User';

@Route('user')
@Tags('User')
export class UserController extends Controller {
  @Get('')
  public getAllUsers(): Promise<User[]> {
    return new UserService().getAllUsers();
  }
}
