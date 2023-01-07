import {
  In, IsNull, LessThanOrEqual, Not, Repository,
} from 'typeorm';
import User, { PersonalUserParams, UserParams } from '../entities/User';
import { ApiError, HTTPStatus } from '../helpers/error';
import { getDataSource } from '../database/dataSource';
import ParticipantService from './ParticipantService';
import Ticket from '../entities/Ticket';
import Role from '../entities/Role';
// eslint-disable-next-line import/no-cycle
import AuthService from './AuthService';
import { Mailer } from '../mailer';
import SetPasswordReminder from '../mailer/templates/SetPasswordReminder';
import TracksReminder from '../mailer/templates/TracksReminder';
import FinalParticipantInfo from '../mailer/templates/FinalParticipantInfo';
import Partner, { SponsorPackage } from '../entities/Partner';

export interface GetUserParams {
  subscriptions: boolean;
}

export interface SendSetPasswordReminderParams {
  ids: number[];
  date: Date;
}

export default class UserService {
  repo: Repository<User>;

  constructor(repo?: Repository<User>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(User);
  }

  /**
   * Get all Users
   */
  public async getAllUsers(params?: GetUserParams): Promise<User[]> {
    const relations = ['ticket', 'roles'];
    if (params && params.subscriptions) {
      relations.push('subscriptions', 'subscriptions.activity', 'subscriptions.activity.programPart');
    }
    return this.repo.find({ relations });
  }

  /**
   * Get one User
   * TODO: Add relations in findOne()
   */
  async getUser(id: number, params?: GetUserParams): Promise<User> {
    const relations = ['ticket', 'roles'];
    if (params && params.subscriptions) relations.push('subscriptions');

    const user = await this.repo.findOne({ where: { id }, relations });
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

  /**
   * Get all users who still haven't set a password for their account.
   * @param date User creation date for which people should receive an email
   * @param returnIdentity
   */
  async getSetPasswordReminderUsers(date: Date, returnIdentity = false): Promise<User[]> {
    const users = await this.repo.find({
      where: {
        emailVerified: false,
        createdAt: LessThanOrEqual(date),
        identity: Not(IsNull()),
      },
      relations: {
        identity: true,
      },
    });

    const result = users.filter((u) => u.identity != null);
    if (returnIdentity) return result;
    return result.map((u) => ({ ...u, identity: null } as any as User));
  }

  /**
   * Get all users who have not yet subscribed to 3 or more tracks
   */
  async getTrackReminderUsers(): Promise<User[]> {
    const users = await this.repo.find({
      where: {
        participantInfo: Not(IsNull()),
      },
      relations: {
        subscriptions: true,
        participantInfo: true,
      },
    });

    return users.filter((u) => u.participantInfo != null && u.subscriptions.length < 3);
  }

  /**
   * Send an email to all users who still have to set a password
   * @param params
   */
  async sendSetPasswordReminders(params: SendSetPasswordReminderParams): Promise<void> {
    const users = await this.getSetPasswordReminderUsers(params.date, true);

    if (users.length < params.ids.length) {
      throw new ApiError(HTTPStatus.BadRequest, 'Some users have already set a password');
    } else if (users.length > params.ids.length) {
      throw new ApiError(HTTPStatus.BadRequest, 'Some users missing from the list, but should receive an email.');
    }
    if (users.some((u) => u.identity === undefined)) throw new ApiError(HTTPStatus.BadRequest, 'Not all users can set a password');

    users.forEach((user) => {
      Mailer.getInstance().send(user, new SetPasswordReminder({
        name: user.name,
        email: user.email,
        token: new AuthService().getResetPasswordToken(user, user.identity!),
        createDate: user.createdAt,
      }));
    });
  }

  /**
   * Send an email to all users who still have to subscribe for at least one track
   * @param ids
   */
  async sendTrackReminders(ids: number[]): Promise<void> {
    const users = await this.getTrackReminderUsers();

    if (users.length > ids.length) {
      throw new ApiError(HTTPStatus.BadRequest, 'Some users missing from the list, but should receive an email.');
    }

    users.forEach((user) => {
      Mailer.getInstance().send(user, new TracksReminder({
        name: user.name,
      }));
    });
  }

  /**
   * Construct the email and send it to the given user
   * @param user
   * @param platinum
   * @param gold
   * @private
   */
  private constructFinalInfoMail(user: User, platinum: Partner[], gold: Partner[]) {
    const sorted = user.subscriptions ? user.subscriptions
      .sort((a, b) => a.activity.programPart.beginTime.getTime()
        - b.activity.programPart.beginTime.getTime()) : undefined;

    Mailer.getInstance().send(user, new FinalParticipantInfo({
      name: user.name,
      ticketCode: user.ticket?.code || '???',
      track1: sorted && sorted[0] ? {
        name: sorted[0].activity.name,
        location: sorted[0].activity.location,
        beginTime: sorted[0].activity.programPart.beginTime,
        endTime: sorted[0].activity.programPart.endTime,
      } : undefined,
      track2: sorted && sorted[1] ? {
        name: sorted[1].activity.name,
        location: sorted[1].activity.location,
        beginTime: sorted[1].activity.programPart.beginTime,
        endTime: sorted[1].activity.programPart.endTime,
      } : undefined,
      track3: sorted && sorted[2] ? {
        name: sorted[2].activity.name,
        location: sorted[2].activity.location,
        beginTime: sorted[2].activity.programPart.beginTime,
        endTime: sorted[2].activity.programPart.endTime,
      } : undefined,
      partners: platinum.concat(gold.sort(() => Math.random() - 0.5)),
    }));
  }

  /**
   * Final info email to a single user
   * @param user
   */
  async sendFinalInfoSingleUser(user: User) {
    const partners = (await getDataSource().getRepository(Partner).find({
      where: {
        description: Not(IsNull()),
      },
    })).filter((p) => p.description !== '');

    const platinum = partners.filter((p) => p.package === SponsorPackage.PLATINUM);
    const gold = partners.filter((p) => p.package === SponsorPackage.GOLD);

    await this.constructFinalInfoMail(user, platinum, gold);
  }

  /**
   * Final info to all users
   */
  async sendFinalInfoAllUsers() {
    const users = (await this.repo.find({
      where: {
        participantInfo: Not(IsNull()),
      },
      relations: {
        subscriptions: {
          activity: {
            programPart: true,
          },
        },
        participantInfo: true,
        ticket: true,
      },
    })).filter((u) => u.participantInfo != null);

    const partners = (await getDataSource().getRepository(Partner).find({
      where: {
        description: Not(IsNull()),
      },
    })).filter((p) => p.description !== '');

    const platinum = partners.filter((p) => p.package === SponsorPackage.PLATINUM);
    const gold = partners.filter((p) => p.package === SponsorPackage.GOLD);

    await Promise.all(users.map((user) => this.constructFinalInfoMail(user, platinum, gold)));
  }
}
