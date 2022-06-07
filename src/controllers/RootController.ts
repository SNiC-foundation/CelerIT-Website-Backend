import {
  Controller, Get, Request, Response, Route, Security, Tags,
} from 'tsoa';
import express from 'express';
import { WrappedApiError } from '../helpers/error';
import User from '../entities/User';
import AuthService from '../services/AuthService';

@Route('')
@Tags('Root')
export class RootController extends Controller {
  @Get('ping')
  @Security('local')
  public ping(): string {
    return 'pong';
  }

  @Get('profile')
  @Security('local')
  @Response<WrappedApiError>(401)
  public async getProfile(@Request() req: express.Request): Promise<User | null> {
    return new AuthService().getProfile(req);
  }
}
