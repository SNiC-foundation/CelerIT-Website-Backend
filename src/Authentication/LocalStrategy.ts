import passport from 'passport';
import passportLocal, { IVerifyOptions } from 'passport-local';
import crypto from 'crypto';
import express from 'express';
import { body, check, validationResult } from 'express-validator';
import User from '../entities/User';
import LocalAuthenticator from '../entities/Authentication/LocalAuthenticator';

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function hashPassword(password: string, salt: string) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

export function config() {
  passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
  });

  passport.deserializeUser((id: number, done) => {
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });

  const LocalStrategy = passportLocal.Strategy;

  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => (
    User.findOne({ where: { email } }).then((user) => {
      if (!user) {
        done(undefined, false, { message: 'Email is not registered.' });
        return;
      }
      (LocalAuthenticator.findOne({ where: { userId: user.id }, relations: ['user'] }).then((auth) => {
        if (!auth) {
          return done(undefined, false, { message: 'Incorrect username or password.' });
        }

        const hashedPassword = hashPassword(password, auth.salt);
        if (!crypto.timingSafeEqual(Buffer.from(auth.hash), Buffer.from(hashedPassword))) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, auth);
      }));
    })).catch((err) => done(err))));
}

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
    req.logIn(user, (error) => {
      if (err) {
        return next(error);
      }
      return res.status(200).send();
    });
    return undefined;
  })(req, res, next);
  return undefined;
}
