import { Controller, Get, Route } from "tsoa";

@Route('')
export class RootController extends Controller {
  @Get('ping')
  public ping(): string {
    return 'pong';
  }
}
