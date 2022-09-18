import {
  Controller, Get, Route, Security, Tags,
} from 'tsoa';

@Route('')
@Tags('Root')
export class RootController extends Controller {
  @Get('ping')
  @Security('local')
  public ping(): string {
    return 'pong';
  }
}
