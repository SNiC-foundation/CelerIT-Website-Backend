import {
  FindOptionsWhere, IsNull, Not, Repository,
} from 'typeorm';
import crypto from 'crypto';
import bs58 from 'bs58';
import { getDataSource } from '../database/dataSource';
import Ticket, { TicketParams } from '../entities/Ticket';
import { ApiError, HTTPStatus } from '../helpers/error';
import TicketScan from '../entities/TicketScan';
import User from '../entities/User';

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

  ticketScanRepo: Repository<TicketScan>;

  constructor(repo?: Repository<Ticket>) {
    this.repo = repo !== undefined ? repo : getDataSource().getRepository(Ticket);
    this.ticketScanRepo = getDataSource().getRepository(TicketScan);
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
   * Get single ticket with the given code
   * @param code
   */
  getSingleTicket(code: string): Promise<Ticket | null> {
    const ticket = this.repo.findOne({ where: { code }, relations: ['user'] });
    if (ticket == null) throw new ApiError(HTTPStatus.NotFound, 'Ticket not found.');
    return ticket;
  }

  /**
   * Scan ticket. Provides more info about the corresponding user and saves scan record
   * @param code
   * @param user
   */
  async scanTicket(code: string, user: User): Promise<Ticket | null> {
    const ticket = await this.repo.findOne({
      where: { code },
      relations: {
        scans: true,
        user: {
          subscriptions: true,
          participantInfo: true,
        },
      },
    });
    if (ticket == null) throw new ApiError(HTTPStatus.NotFound, 'Ticket not found.');

    // Somehow the relation does not work. No idea why, no time to look for an actual fix
    ticket.scans = await this.ticketScanRepo.find({
      where: { ticketId: ticket.id },
      relations: { user: true },
    });
    const scan = Object.assign(new TicketScan(), {
      ticketId: ticket.id,
      userId: user.id,
    });
    await this.ticketScanRepo.save(scan);
    return ticket;
  }

  /**
   * Checks if the given code corresponds to an unclaimed Ticket
   * @param code
   */
  async getTicketIfValid(code: string): Promise<Ticket | null> {
    const ticket = await this.getSingleTicket(code);
    if (ticket == null || ticket.userId != null) {
      return null;
    }
    return ticket;
  }

  async createTicket(params: TicketParams): Promise<Ticket> {
    const codeBytes = crypto.randomBytes(8);
    const code = bs58.encode(codeBytes);
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

  async deleteTicket(id: number): Promise<void> {
    const ticket = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (ticket == null) throw new ApiError(HTTPStatus.NotFound, 'Ticket not found');
    if (ticket.user != null) throw new ApiError(HTTPStatus.BadRequest, 'Ticket already claimed by participant');
    await this.repo.delete(ticket.id);
  }
}
