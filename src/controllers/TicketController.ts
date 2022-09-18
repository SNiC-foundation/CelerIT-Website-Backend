import {
  Controller, Get, Post, Route, Body, Tags, Query, Security,
} from 'tsoa';
import Ticket from '../entities/Ticket';
import TicketService, { CreateTicketPrams, TicketFilterParameters } from '../services/TicketService';

/**
 * TODO: Add paramater validation
 */
@Route('ticket')
@Tags('Ticket')
export class TicketController extends Controller {
  /**
   * getAllTickets() - retrieve all tickets
   * TODO: Add filter options
   */
  @Get('')
  @Security('local')
  public async getAllTickets(@Query() claimed?: boolean, @Query() association?: string)
        : Promise<Ticket[]> {
    const filters: TicketFilterParameters = {
      claimed,
      association,
    };
    return new TicketService().getAllTickets(filters);
  }

  @Get('{code}')
  public async getSingleTicket(code: string): Promise<Ticket | null> {
    return new TicketService().getSingleTicket(code);
  }

  /**
   * createTicket() - create ticket
   * @param params Parameters to create tickets with
   */
  @Post()
  @Security('local')
  public async createTicket(@Body() params: CreateTicketPrams): Promise<Ticket[]> {
    return new TicketService().createTickets(params);
  }

  // /**
  //  * updateUser() - update user
  //  * @param id ID of user to update
  //  * @param params Update subset of parameter of user
  //  */
  // @Put('{id}')
  // public async updateTicket(id: number, @Body() params: Partial<UserParams>): Promise<User> {
  //   return new UserService().updateUser(id, params);
  // }
  //
  // /**
  //  * Delete user
  //  * @param id ID of the user to delete
  //  */
  // @Delete('{id}')
  // public async deleteUser(id: number): Promise<void> {
  //   return new UserService().deleteUser(id);
  // }
}
