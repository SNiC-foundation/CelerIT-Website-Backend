import {
  Body, Get, Post, Request, Response, Route, Security, Tags,
} from 'tsoa';
import { Controller } from '@tsoa/runtime';
import express from 'express';
import { ApiError, HTTPStatus, WrappedApiError } from '../helpers/error';
import User, { CreateParticipantUserParams } from '../entities/User';
import TicketService from '../services/TicketService';
import UserService from '../services/UserService';
import AuthService, { ForgotPasswordRequest, ResetPasswordRequest } from '../services/AuthService';
import BarcodeGenerator from '../qrcodes/BarcodeGenerator';
import { barcodeDirLoc } from '../services/FileService';

export interface RegisterUserParams {
  user: CreateParticipantUserParams,
  token: string,
}

@Route('')
@Tags('Authentication')
export class AuthController extends Controller {
  /**
   * createUser() - create user
   * @param params Parameters to create user with
   */
  @Post('register')
  @Response<WrappedApiError>(400)
  public async registerUser(@Body() params: RegisterUserParams): Promise<User> {
    const ticket = await new TicketService().getTicketIfValid(params.token);
    if (ticket === null) throw new ApiError(HTTPStatus.BadRequest, 'Invalid Token');
    const user = await new UserService().registerUser({
      ...params.user,
      partnerId: null,
      participantInfo: {
        ...params.user.participantInfo,
      },
    }, ticket);
    await new AuthService().createIdentityLocal(user, true, false);
    await new BarcodeGenerator(ticket.code, barcodeDirLoc).generateCode();
    return user;
  }

  @Post('forgot-password')
  @Response<WrappedApiError>(400)
  public async forgotPassword(@Body() params: ForgotPasswordRequest) {
    return new AuthService().forgotPassword(params.email);
  }

  @Post('reset-password')
  @Response<WrappedApiError>(400)
  public async resetPassword(@Body() params: ResetPasswordRequest) {
    return new AuthService().resetPassword(params.newPassword, params.token);
  }

  @Get('profile')
  @Security('local')
  @Response<WrappedApiError>(401)
  public async getProfile(@Request() req: express.Request): Promise<User | null> {
    return new AuthService().getProfile(req);
  }

  @Post('logout')
  @Security('local')
  public async logout(@Request() req: express.Request): Promise<void> {
    return new AuthService().logout(req);
  }
}
