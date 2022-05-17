import { Repository } from 'typeorm';
import User, { UserParams } from '../entities/User';
import AppDataSource from '../database/dataSource';
import { HTTPStatus, ApiError } from '../helpers/error';

export default class UserService {
  repo: Repository<User>;

  constructor(repo?: Repository<User>) {
    this.repo = repo !== undefined ? repo : AppDataSource.getRepository(User);
  }

  /**
   * Get all Users
   */
  public async getAllUsers(): Promise<User[]> {
    return this.repo.find();
  }

  /**
   * Get one User
   * TODO: Add relations in findOne()
   */
  async getUser(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (user == null) {
      throw new ApiError(HTTPStatus.NotFound, 'User not found');
    }
    return user;
  }

  /**
   * Create User
   */
  createUser(params: UserParams): Promise<User> {
    const user = {
      ...params,
    } as any as User;
    return this.repo.save(user);
  }

  /**
   * Update User
   */
  async updateUser(id: number, params: Partial<UserParams>): Promise<User> {
    await this.repo.update(id, params);
    const user = await this.getUser(id);

    if (user == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    return user;
  }

  /**
   * Delete User
   * TODO: Add relations in findOne()
   */
  async deleteUser(id: number): Promise<void> {
    const user = await this.repo.findOne({ where: { id } });

    if (user == null) {
      throw new ApiError(HTTPStatus.NotFound, 'User not found');
    }

    await this.repo.delete(user.id);
  }
}