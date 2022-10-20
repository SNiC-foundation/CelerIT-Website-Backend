import { Repository } from 'typeorm';
import faker from '@faker-js/faker';
import crypto from 'crypto';
import User, { UserParams } from '../entities/User';
import { HTTPStatus, ApiError } from '../helpers/error';
import { getDataSource } from '../database/dataSource';
import ParticipantService from './ParticipantService';
import Ticket from '../entities/Ticket';

export default class UserService {
  repo: Repository<User>;

  constructor(repo?: Repository<User>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(User);
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
    const user = await this.repo.findOne({ where: { id }, relations: ['ticket'] });
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
      emailVerified: false,
    } as any as User;
    return this.repo.save(user);
  }

  /**
   * Register User with a Ticket
   */
  async registerUser(params: UserParams, ticket: Ticket): Promise<User> {
    return Promise.resolve(getDataSource().manager.transaction((manager) => {
      const user = Object.assign(new User(), {
        ...params,
      }) as User;
      return manager.save(user).then((u) => {
        // eslint-disable-next-line no-param-reassign
        ticket.user = u;
        return manager.save(ticket).then(() => u);
      });
    }));
  }

  /**
   * Update User
   */
  async updateUser(id: number, params: Partial<UserParams>): Promise<User> {
    const { participantInfo, ...rest } = params;
    await this.repo.update(id, rest);
    const user = await this.getUser(id);

    if (user == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    if (user.participantInfo && participantInfo) {
      await new ParticipantService().updateParticipant(user.participantInfo.id, participantInfo);
    } else if (!user.participantInfo && participantInfo) {
      await new ParticipantService().createParticipant({
        ...participantInfo,
        userId: user.id,
      });
    } else if (user.participantInfo && !participantInfo) {
      await new ParticipantService().deleteParticipant(user.participantInfo.id);
    }

    return this.getUser(id);
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

    if (user.participantInfo != null) {
      await new ParticipantService().deleteParticipant(user.participantInfo.id);
    }

    await this.repo.delete(user.id);
  }
}
