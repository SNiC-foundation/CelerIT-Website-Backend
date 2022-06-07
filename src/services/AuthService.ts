import { Repository } from 'typeorm';
import express from 'express';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars
import validator from 'validator';
import User from '../entities/User';
import LocalAuthenticator from '../entities/Authentication/LocalAuthenticator';
import { generateSalt, hashPassword } from '../Authentication/LocalStrategy';
import { ApiError, HTTPStatus } from '../helpers/error';
import { getDataSource } from '../database/dataSource';

const INVALID_TOKEN = 'Invalid token.';
export interface AuthStatus {
    authenticated: boolean;
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
    const user = (await this.userRepo.findOne(
      {
        where: { id: (req.user as User).id },
        relations: ['roles'],
      },
    ));

    return user;
  }

  async logout(req: express.Request) : Promise<void> {
    req.logout();
  }

  // eslint-disable-next-line no-unused-vars
  async forgotPassword(userEmail: string): Promise<void> {
    // let email = validator.normalizeEmail(userEmail);
    // if (email === false) {
    //   email = '';
    // }
    // const user = await this.userRepo.findOneBy({ email });
    // const identity = user !== undefined
    //   ? await this.LocalAuthenticatorRepo.findOneBy({ userId: user?.id }) : undefined;
    //
    // if (user == null || identity == null) {
    //   return;
    // }

    // eslint-disable-next-line max-len
    // Mailer.getInstance().send(resetPassword(user, `${process.env.SERVER_HOST}/reset-password?token=${this.getResetPasswordToken(user, identity)}`));
  }

  async createIdentityLocal(user: User, silent: boolean): Promise<LocalAuthenticator> {
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
      // eslint-disable-next-line max-len
      // Mailer.getInstance().send(newUser(user, `${process.env.SERVER_HOST}/reset-password?token=${this.getSetPasswordToken(user, identity)}`));
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

    const user = await this.userRepo.findOneBy({ id: token.user_id });
    const identity = await this.LocalAuthenticatorRepo.findOneBy({ userId: token.user_id });
    // Check if the user is defined
    if (user == null || identity == null) {
      throw new ApiError(HTTPStatus.BadRequest, INVALID_TOKEN);
    }

    try {
      switch (token.type) {
        case 'PASSWORD_RESET':
        case 'PASSWORD_SET':
        {
          // Verify the token
          jwt.verify(tokenString, `${identity.salt || ''}.${user.createdAt}`);
          const salt = generateSalt();
          await this.LocalAuthenticatorRepo.update(user.id, {
            userId: user.id,
            // email: user.email,
            verifiedEmail: true,
            hash: hashPassword(newPassword, salt),
            salt,
          });
          return;
        }
        default:
          throw new ApiError(HTTPStatus.BadRequest, INVALID_TOKEN);
      }
    } catch (e) {
      throw new ApiError(HTTPStatus.BadRequest, INVALID_TOKEN);
    }
  }

  async deleteIdentities(id: number) {
    await this.LocalAuthenticatorRepo.softDelete(id);
  }
}
