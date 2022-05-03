import {
  Controller, Post, Route, Tags,
} from 'tsoa';
import { NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import User from '../entities/User';

@Route('/login')
@Tags('Authentication')
export class AuthenticationController extends Controller {
  @Post('')
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    await check('email', 'Email is not valid').isEmail().run(req);
    await check('password', 'Password cannot be blank').isLength({ min: 1 }).run(req);
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect('/login');
    }

    passport.authenticate('local', (err: Error, user: User, info: IVerifyOptions) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: info.message });
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash('success', { msg: 'Success! You are logged in.' });
        res.redirect(req.session.returnTo || '/');
      });
    })(req, res, next);
  }
  //
  // /**
  //  * Sign in using email and password.
  //  * @route POST /login
  //  */
  // export const postLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //     await check("email", "Email is not valid").isEmail().run(req);
  //     await check("password", "Password cannot be blank").isLength({min: 1}).run(req);
  //     await body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
  //
  //     const errors = validationResult(req);
  //
  //     if (!errors.isEmpty()) {
  //         req.flash("errors", errors.array());
  //         return res.redirect("/login");
  //     }
  //
  //     passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
  //         if (err) { return next(err); }
  //         if (!user) {
  //             req.flash("errors", {msg: info.message});
  //             return res.redirect("/login");
  //         }
  //         req.logIn(user, (err) => {
  //             if (err) { return next(err); }
  //             req.flash("success", { msg: "Success! You are logged in." });
  //             res.redirect(req.session.returnTo || "/");
  //         });
  //     })(req, res, next);
  // };
}
