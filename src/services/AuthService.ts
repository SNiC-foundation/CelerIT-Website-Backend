import { Repository } from 'typeorm';
import express from 'express';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars
import validator from 'validator';
import User from '../entities/User';
import LocalAuthenticator from '../entities/Authentication/LocalAuthenticator';
import { generateSalt, hashPassword } from '../authentication/LocalStrategy';
import { ApiError, HTTPStatus } from '../helpers/error';
import { getDataSource } from '../database/dataSource';
import { Mailer, PasswordReset, WelcomeWithReset } from '../mailer';
import AccountForYou from '../mailer/templates/AccountForYou';
// eslint-disable-next-line import/no-cycle
import UserService from './UserService';

const INVALID_TOKEN = 'Invalid token.';
export interface AuthStatus {
    authenticated: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export default class AuthService {
  userRepo: Repository<User>;

  LocalAuthenticatorRepo: Repository<LocalAuthenticator>;

  constructor(
    LocalAuthenticatorRepo?: Repository<LocalAuthenticator>,
    userRepo?: Repository<User>,
  ) {
    const AppDataSource = getDataSource();
    this.LocalAuthenticatorRepo = LocalAuthenticatorRepo
        ?? AppDataSource.getRepository(LocalAuthenticator);
    this.userRepo = userRepo ?? AppDataSource.getRepository(User);
  }

  async getAuthStatus(req: express.Request): Promise<AuthStatus> {
    const authenticated = req.isAuthenticated();

    return {
      authenticated,
    };
  }

  async getProfile(req: express.Request): Promise<User | null> {
    return this.userRepo.findOne(
      {
        where: { id: (req.user as User).id },
        relations: ['roles', 'subscriptions', 'subscriptions.activity', 'partner', 'ticket'],
      },
    );
  }

  async logout(req: express.Request) : Promise<void> {
    return req.logout({ keepSessionInfo: false }, () => {});
  }

  async forgotPassword(userEmail: string): Promise<void> {
    let email = validator.normalizeEmail(userEmail);
    if (email === false) {
      email = '';
    }
    const user = await this.userRepo.findOneBy({ email });
    // eslint-disable-next-line no-unused-vars
    const identity = user !== undefined
      ? await this.LocalAuthenticatorRepo.findOneBy({ userId: user?.id }) : undefined;

    if (user == null || identity == null) {
      return;
    }

    Mailer.getInstance().send(user, new PasswordReset({
      name: user.name,
      email: user.email,
      token: this.getResetPasswordToken(user, identity),
    }));
  }

  async createIdentityLocal(
    user: User,
    createdYourself: boolean,
    silent: boolean,
  ): Promise<LocalAuthenticator> {
    let identity = await this.LocalAuthenticatorRepo.findOneBy({ userId: user.id });
    if (identity) throw new ApiError(HTTPStatus.BadRequest, 'Identity already exists.');

    identity = this.LocalAuthenticatorRepo.create({
      userId: user.id,
      // email: user.email,
      verifiedEmail: false,
      salt: generateSalt(),
    });
    await this.LocalAuthenticatorRepo.insert(identity);
    identity = (await this.LocalAuthenticatorRepo.findOneBy({ userId: user.id }))!;

    if (!silent) {
      if (createdYourself) {
        Mailer.getInstance().send(user, new WelcomeWithReset({
          name: user.name,
          email: user.email,
          token: this.getSetPasswordToken(user, identity),
        }));
      } else {
        Mailer.getInstance().send(user, new AccountForYou({
          name: user.name,
          email: user.email,
          token: this.getSetPasswordToken(user, identity),
        }));
      }
    }

    return identity!;
  }

  getResetPasswordToken(user: User, identity: LocalAuthenticator): string {
    return jwt.sign(
      {
        type: 'PASSWORD_RESET',
        user_id: user.id,
      },
      // Password salt + user createdAt as unique key
      `${identity.salt || ''}.${user.createdAt}`,
      { expiresIn: '7 days' },
    );
  }

  getSetPasswordToken(user: User, identity: LocalAuthenticator): string {
    return jwt.sign(
      {
        type: 'PASSWORD_SET',
        user_id: user.id,
      },
      // Password salt + user createdAt as unique key
      `${identity.salt || ''}.${user.createdAt}`,
      { expiresIn: '7 days' },
    );
  }

  async resetPassword(newPassword: string, tokenString: string): Promise<void> {
    const token = jwt.decode(tokenString);
    if (!(token && typeof token !== 'string')) {
      throw new ApiError(HTTPStatus.BadRequest, INVALID_TOKEN);
    }

    const user = await this.userRepo.findOne({ where: { id: token.user_id }, relations: ['participantInfo', 'ticket'] });
    const identity = await this.LocalAuthenticatorRepo.findOneBy({ userId: token.user_id });
    // Check if the user is defined
    if (user == null || identity == null) {
      throw new ApiError(HTTPStatus.BadRequest, INVALID_TOKEN);
    }

    try {
      // Verify the token
      jwt.verify(tokenString, `${identity.salt || ''}.${user.createdAt}`);
      const salt = generateSalt();

      switch (token.type) {
        case 'PASSWORD_RESET':
        case 'PASSWORD_SET':
        {
          await this.LocalAuthenticatorRepo.update(user.id, {
            userId: user.id,
            verifiedEmail: true,
            hash: hashPassword(newPassword, salt),
            salt,
          });
          break;
        }
        default:
          throw new ApiError(HTTPStatus.BadRequest, INVALID_TOKEN);
      }
    } catch (e) {
      throw new ApiError(HTTPStatus.BadRequest, INVALID_TOKEN);
    }

    if (!user.emailVerified && user.participantInfo !== undefined) {
      // await Mailer.getInstance().send(user,
      // new TicketActivated({ name: user.name, ticketCode: user.ticket?.code || '' }));
      await new UserService().sendFinalInfoSingleUser(user);
      user.emailVerified = true;
      await user.save();
    }
  }

  async deleteIdentities(id: number) {
    await this.LocalAuthenticatorRepo.delete(id);
  }
}
