import {
  Controller, Get, Route, Tags,
} from 'tsoa';

@Route('')
@Tags('Root')
export class RootController extends Controller {
  @Get('ping')
  public ping(): string {
    return 'pong';
  }
}
