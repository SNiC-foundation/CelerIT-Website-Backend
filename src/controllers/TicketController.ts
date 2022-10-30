import {
  Controller, Get, Post, Route, Body, Tags, Query, Security, Delete, Request,
} from 'tsoa';
import express from 'express';
import Ticket from '../entities/Ticket';
import TicketService, { CreateTicketPrams, TicketFilterParameters } from '../services/TicketService';
import User from '../entities/User';

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
  @Security('local', ['Admin'])
  public async getAllTickets(
    @Query() claimed?: boolean,
    @Query() association?: string,
  ): Promise<Ticket[]> {
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

  @Get('{code}/scan')
  @Security('local', ['Admin', 'Volunteer'])
  public async scanSingleTicket(
    code: string,
    @Request() request: express.Request,
  ): Promise<Ticket | null> {
    return new TicketService().scanTicket(code, request.user as User);
  }

  /**
   * createTicket() - create ticket
   * @param params Parameters to create tickets with
   */
  @Post()
  @Security('local', ['Admin'])
  public async createTicket(@Body() params: CreateTicketPrams): Promise<Ticket[]> {
    return new TicketService().createTickets(params);
  }

  /**
   * Delete user
   * @param id ID of the user to delete
   */
  @Delete('{id}')
  @Security('local', ['Admin'])
  public async deleteTicket(id: number): Promise<void> {
    return new TicketService().deleteTicket(id);
  }
}
