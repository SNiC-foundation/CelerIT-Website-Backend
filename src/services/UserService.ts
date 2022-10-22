import { In, Repository } from 'typeorm';
import User, { PersonalUserParams, UserParams } from '../entities/User';
import { ApiError, HTTPStatus } from '../helpers/error';
import { getDataSource } from '../database/dataSource';
import ParticipantService from './ParticipantService';
import Ticket from '../entities/Ticket';
import Role from '../entities/Role';
import { TicketActivated } from '../mailer';
import AuthService from './AuthService';

export default class UserService {
  repo: Repository<User>;

  constructor(repo?: Repository<User>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(User);
  }

  /**
   * Get all Users
   */
  public async getAllUsers(): Promise<User[]> {
    return this.repo.find({ relations: ['ticket', 'roles'] });
  }

  /**
   * Get one User
   * TODO: Add relations in findOne()
   */
  async getUser(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id }, relations: ['ticket', 'roles'] });
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
      emailVerified: true,
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
        emailVerified: false,
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
    // eslint-disable-next-line no-param-reassign
    if (!params.partnerId) params.partnerId = null;
    return this.updateUserProfile(id, params);
  }

  /**
   * Update User (personal)
   */
  async updateUserProfile(
    id: number,
    params: Partial<UserParams> | Partial<PersonalUserParams>,
  ): Promise<User> {
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
   * Update the roles of a user
   * @param id
   * @param roleIds
   */
  async updateUserRoles(id: number, roleIds: number[]): Promise<User> {
    const user = await this.getUser(id);

    if (user == null) {
      throw new ApiError(HTTPStatus.NotFound);
    }

    user.roles = await getDataSource().getRepository(Role).find({ where: { id: In(roleIds) } });
    await this.repo.save(user);

    return this.getUser(id);
  }

  /**
   * Delete User
   * TODO: Add relations in findOne()
   */
  async deleteUser(id: number): Promise<void> {
    const user = await this.repo.findOne({ where: { id }, relations: ['participantInfo', 'ticket'] });

    if (user == null) {
      throw new ApiError(HTTPStatus.NotFound, 'User not found');
    }

    if (user.participantInfo != null) {
      await new ParticipantService().deleteParticipant(user.participantInfo.id);
    }

    if (user.ticket != null) {
      const ticketRepo = getDataSource().getRepository(Ticket);
      const ticket = await ticketRepo.findOne({ where: { userId: user.id } });
      if (ticket == null) throw new Error();
      ticket.userId = null;
      ticket.user = null;
      await ticket.save();
    }

    await new AuthService().deleteIdentities(user.id);

    await this.repo.delete(user.id);
  }
}
