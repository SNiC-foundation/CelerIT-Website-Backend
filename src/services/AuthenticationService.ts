import passport from 'passport';
import passportLocal from 'passport-local';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import LocalAuthenticator from '../entities/Authentication/LocalAuthenticator';
import User from '../entities/User';

export default class AuthenticationService {
  public config() {
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
      (LocalAuthenticator.findOne({ where: { user: { email } }, relations: ['user'] }).then((auth) => {
        if (!auth) {
          return done(undefined, false, { message: 'Incorrect username or password.' });
        }
        return crypto.pbkdf2(password, auth.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
          if (err) { return done(err); }
          if (!crypto.timingSafeEqual(Buffer.from(auth.hash), hashedPassword)) {
            return done(null, false, { message: 'Incorrect username or password.' });
          }
          return done(null, auth);
        });
      }))).catch((err) => done(err))));
  }

  /**
     * Login Required middleware.
     */
  public isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
}
