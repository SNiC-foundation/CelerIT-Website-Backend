import passport from 'passport';
import passportLocal, { IVerifyOptions, VerifyFunction } from 'passport-local';
import crypto from 'crypto';
import express from 'express';
import { body, check, validationResult } from 'express-validator';
import User from '../entities/User';
import LocalAuthenticator from '../entities/Authentication/LocalAuthenticator';
import { getDataSource } from '../database/dataSource';

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function hashPassword(password: string, salt: string) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

/**
 * Define local Verification function
 * @param email
 * @param password
 * @param done
 */
export const localVerification: VerifyFunction = (
  email:string,
  password:string,
  // eslint-disable-next-line no-unused-vars
  done: (error: any, user?: any, options?: any) => void,
) => {
  User.findOne({ where: { email } }).then((user) => {
    if (!user) {
      done(undefined, false, { message: 'Email is not registered.' });
      return;
    }
    (LocalAuthenticator.findOne({ where: { userId: user.id }, relations: ['user'] }).then((auth) => {
      // If no authentication exists we give a general error.
      if (!auth) {
        return done(undefined, false, { message: 'Incorrect username or password.' });
      }

      const hashedPassword = hashPassword(password, auth.salt);
      if (!crypto.timingSafeEqual(Buffer.from(auth.hash || ''), Buffer.from(hashedPassword))) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, auth);
    }));
  }).catch((err) => done(err, false));
};

/**
 * Passport initialization function, called when app is starting.
 */
export function config() {
  /**
   * We flatten users to their userId
   */
  passport.serializeUser((user, done) => {
    done(null, (user as LocalAuthenticator).userId);
  });

  /**
   * Deserialize user by retrieving it from the repository.
   */
  passport.deserializeUser(async (id: number, done) => {
    const userRepo = getDataSource().getRepository(User);
    const user = await userRepo.findOne({ where: { id }, relations: ['roles'] });
    if (user === undefined) {
      return done(null, false);
    }
    return done(null, user);
  });

  const LocalStrategy = passportLocal.Strategy;

  passport.use(new LocalStrategy({ usernameField: 'email' }, localVerification));
}

/**
 * Express login and session creation.
 * @param req
 * @param res
 * @param next
 */
export async function localLogin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  await check('email', 'Email is not valid').isEmail().run(req);
  await check('password', 'Password cannot be blank').isLength({ min: 1 }).run(req);
  await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
    return undefined;
  }

  passport.authenticate('local', (err: Error, user: User, info: IVerifyOptions) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(403).json(info.message).send();
    }

    return req.login(user, (e: any) => {
      // When the user enabled "remember me", we give the session cookie an
      // expiration date of 30 days
      if (req.body.rememberMe === true) {
        req.session.cookie.maxAge = 2592000000; // 30 * 24 * 60 * 60 * 1000 (30 days)
        // Otherwise, just create it as a temporary session cookie
      } else {
        req.session.cookie.maxAge = undefined;
      }
      if (e) { return next(e); }
      return res.send();
    });
  })(req, res, next);
  return undefined;
}
