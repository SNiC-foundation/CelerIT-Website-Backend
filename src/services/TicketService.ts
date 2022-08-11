import {
  FindOptionsWhere, Not, IsNull, Repository,
} from 'typeorm';
import crypto from 'crypto';
import { getDataSource } from '../database/dataSource';
import Ticket, { TicketParams } from '../entities/Ticket';

/**
 * @typedef TicketFilterParameters
 * @property {boolean} claimed - If the ticket has been claimed
 * @property {string} association - Name of the association that was given this ticket
 */
export interface TicketFilterParameters {
  claimed?: boolean,
  association?: string,
}

/**
 * @typedef CreateTicketPrams
 * @property {integer} amount - Amount of tickets to create
 * @property {string} association - Name of the association that was given this ticket
 */
export interface CreateTicketPrams extends TicketParams {
  amount: number,
}

export default class TicketService {
  repo: Repository<Ticket>;

  constructor(repo?: Repository<Ticket>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(Ticket);
  }

  /**
   * Get all tickets
   */
  public async getAllTickets(filters?: TicketFilterParameters): Promise<Ticket[]> {
    const where: FindOptionsWhere<Ticket> = {
      association: filters?.association,
    };
    if (filters?.claimed !== undefined) where.userId = filters.claimed ? Not(IsNull()) : IsNull();
    return this.repo.find({ relations: ['user'], where: { ...where } });
  }

  /**
   * Checks if the given code corresponds to an unclaimed Ticket
   * @param code
   */
  async getTicketIfValid(code: string): Promise<Ticket | null> {
    return this.repo.findOne({ where: { code, userId: IsNull() } });
  }

  async createTicket(params: TicketParams): Promise<Ticket> {
    const code = crypto.randomBytes(16).toString('hex');
    const ticket = Object.assign(new Ticket(), {
      association: params.association,
      code,
    });
    return Ticket.save(ticket);
  }

  async createTickets(params: CreateTicketPrams): Promise<Ticket[]> {
    const promises: Promise<any>[] = [];
    const tickets: Ticket[] = [];
    for (let i = 0; i < params.amount; i += 1) {
      promises.push(this.createTicket(params).then((t) => tickets.push(t)));
    }
    await Promise.all(promises);
    return tickets;
  }
}
