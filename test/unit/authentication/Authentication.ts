import { expect, request } from 'chai';
import { DataSource } from 'typeorm';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import LocalAuthenticatorFactory from '../../database/factories/LocalAuthenticatorFactory';
import { initializeDataSource } from '../../../src/database/dataSource';
import { localLogin, localVerification } from '../../../src/authentication/LocalStrategy';
import { expressAuthentication } from '../../../src/authentication/Authentication';
import { ApiError, HTTPStatus } from '../../../src/helpers/error';
import { setupSessionSupport } from '../../../src/app';

describe('Authentication', () => {
  let dataSource: DataSource;
  let authFactory: LocalAuthenticatorFactory;
  let app: Express;

  before(async () => {
    dataSource = await initializeDataSource();
    authFactory = (new LocalAuthenticatorFactory(dataSource));

    app = express();

    // Initialize passport config.
    setupSessionSupport(app);
    app.use(bodyParser.json());
    app.post('/login', localLogin);
  });

  after(async () => {
    await dataSource.destroy();
  });

  describe('expressAuthentication Middleware', () => {
    it('should return the provided user if valid', () => {
      const user = 1;
      expect(expressAuthentication({ user, isAuthenticated: () => true } as any, 'local', {} as any)).to.eventually.eq(user);
    });
    it('should return an error if the provided user is invalid', async () => {
      expect(expressAuthentication({ user: undefined, isAuthenticated: () => false } as any, 'local', {} as any)).to.eventually.eq(new ApiError(HTTPStatus.Unauthorized, 'You are not logged in.'));
    });
    it('should return an error if the provided security scheme is unknown', async () => {
      const user = 1;
      expect(expressAuthentication({ user, isAuthenticated: () => true } as any, 'fake', {} as any)).to.eventually.eq(new Error('Unknown security scheme'));
    });
  });

  describe('localVerification', () => {
    const promisedVerification = async (
      email: string,
      name: string,
    ) => new Promise((resolve, reject) => {
      localVerification(email, name, (error: any, user?: any, options?: any) => {
        if (error) reject(error);
        else resolve({ user, options });
      });
    });

    it('should return the user if valid credentials', async () => {
      const auth = await authFactory.createSingle();
      expect(await promisedVerification(auth.user.email, auth.user.name)).to.deep.eq(
        { user: auth, options: undefined },
      );
    });
    it('should return false if the credentials are invalid', async () => {
      const auth = await authFactory.createSingle();
      expect(await promisedVerification(auth.user.email, 'lol')).to.deep.eq({ user: false, options: { message: 'Incorrect username or password.' } });
    });
    it('should return false if the e-mail is not registered', async () => {
      expect(await promisedVerification('sus@amogus.com', 'lol')).to.deep.eq({ user: false, options: { message: 'Email is not registered.' } });
    });
  });

  describe('POST /login', () => {
    it('should return a HTTP 200 if credentials are correct', async () => {
      const auth = await authFactory.createSingle();
      const creds = {
        email: auth.user.email,
        password: auth.user.name,
      };
      const res = await request(app)
        .post('/login')
        .send(creds);
      expect(res.status).to.equal(200);
    });
    it('should return an HTTP 400 if the email is invalid', async () => {
      const creds = {
        email: 'wait this is not an email?',
        password: 'Passw0rd!',
      };
      const res = await request(app)
        .post('/login')
        .send(creds);
      expect(res.status).to.equal(400);
      expect(res.body[0].msg).to.equal('Email is not valid');
    });
    it('should return an HTTP 400 if the password is blank', async () => {
      const creds = {
        email: 'valid@valid.com',
        password: '',
      };
      const res = await request(app)
        .post('/login')
        .send(creds);
      expect(res.status).to.equal(400);
      expect(res.body[0].msg).to.equal('Password cannot be blank');
    });
  });
});
