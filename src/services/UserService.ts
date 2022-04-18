import { Repository } from 'typeorm';
import User from '../entities/User';
import AppDataSource from '../database/dataSource';

export default class UserService {
  repo: Repository<User>;

  constructor(repo?: Repository<User>) {
    this.repo = repo !== undefined ? repo : AppDataSource.getRepository(User);
  }

  /**
   * Get all users
   */
  public async getAllUsers(): Promise<User[]> {
    return this.repo.find();
  }
}
