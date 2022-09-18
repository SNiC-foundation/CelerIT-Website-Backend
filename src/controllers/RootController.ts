import {
  Body, Controller, Get, Post, Request, Response, Route, Security, Tags,
} from 'tsoa';
import express from 'express';
import { ApiError, HTTPStatus, WrappedApiError } from '../helpers/error';
import User, { CreateParticipantUserParams } from '../entities/User';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import TicketService from '../services/TicketService';

export interface RegisterUserParams {
  user: CreateParticipantUserParams,
  token: string,
  password: string,
}

@Route('')
@Tags('Root')
export class RootController extends Controller {
  @Get('ping')
  @Security('local')
  public ping(): string {
    return 'pong';
  }

  /**
   * createUser() - create user
   * @param params Parameters to create user with
   */
  @Post('register')
  @Response<WrappedApiError>(400)
  public async registerUser(@Body() params: RegisterUserParams): Promise<User> {
    const ticket = await new TicketService().getTicketIfValid(params.token);
    if (ticket === null) throw new ApiError(HTTPStatus.BadRequest, 'Invalid Token');
    return new UserService().registerUser({
      ...params.user,
      participantInfo: {
        ...params.user.participantInfo,
        studyAssociation: ticket.association,
      },
    }, ticket);
  }

  @Get('profile')
  @Security('local')
  @Response<WrappedApiError>(401)
  public async getProfile(@Request() req: express.Request): Promise<User | null> {
    return new AuthService().getProfile(req);
  }
}
